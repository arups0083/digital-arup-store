import { NextResponse } from "next/server";
import { z } from "zod";
import { supabaseServer } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

const schema = z.object({
  ebookId: z.string().uuid(),
  amount: z.number().positive(),
  utr: z.string().min(6).max(64),
  coupon: z.string().min(2).max(40).optional(),
});

export async function POST(req: Request) {
  const sb = supabaseServer();
  const { data: auth } = await sb.auth.getUser();
  if (!auth.user) return NextResponse.json({ error: "Not logged in" }, { status: 401 });

  const formData = await req.formData();
  const ebookId = String(formData.get("ebookId") ?? "");
  const amount = Number(formData.get("amount") ?? 0);
  const utr = String(formData.get("utr") ?? "");
  const coupon = formData.get("coupon") ? String(formData.get("coupon")) : undefined;

  const parsed = schema.safeParse({ ebookId, amount, utr, coupon });
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  const admin = supabaseAdmin();

  // Verify ebook exists & active
  const { data: ebook } = await admin.from("ebooks").select("id, price, slug, title").eq("id", ebookId).single();
  if (!ebook) return NextResponse.json({ error: "Ebook not found" }, { status: 404 });

  // coupon validate (optional)
  if (coupon) {
    const { data: c } = await admin.from("coupons").select("*").eq("code", coupon.toUpperCase()).eq("is_active", true).maybeSingle();
    if (!c) return NextResponse.json({ error: "Invalid coupon" }, { status: 400 });
    if (c.expires_at && new Date(c.expires_at).getTime() < Date.now()) return NextResponse.json({ error: "Coupon expired" }, { status: 400 });
    if (c.usage_limit !== null && c.used_count >= c.usage_limit) return NextResponse.json({ error: "Coupon usage limit reached" }, { status: 400 });
  }

  // upload proof optional
  let proofPath: string | null = null;
  const proof = formData.get("proof");
  if (proof && typeof proof !== "string") {
    const file = proof as File;
    const bytes = new Uint8Array(await file.arrayBuffer());
    const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
    const path = `${auth.user.id}/${Date.now()}-${Math.random().toString(16).slice(2)}.${ext}`;
    const up = await admin.storage.from("payment_proofs").upload(path, bytes, { contentType: file.type || "image/jpeg", upsert: false });
    if (up.error) return NextResponse.json({ error: up.error.message }, { status: 400 });
    proofPath = path;
  }

  // affiliate code from cookie (server can't read cookie from client fetch easily? We can read from request headers cookie)
  const cookieHeader = req.headers.get("cookie") ?? "";
  const refMatch = cookieHeader.match(/(?:^|;\s*)da_ref=([^;]+)/);
  const affiliateCode = refMatch ? decodeURIComponent(refMatch[1]) : null;

  // create order
  const { data: order, error } = await admin.from("orders").insert({
    user_id: auth.user.id,
    ebook_id: ebookId,
    amount,
    coupon_code: coupon ? coupon.toUpperCase() : null,
    utr,
    proof_path: proofPath,
    status: "pending",
    affiliate_code: affiliateCode,
  }).select("id").single();

  if (error || !order) return NextResponse.json({ error: error?.message ?? "Order create failed" }, { status: 400 });

  // increment coupon usage if used (best-effort)
  if (coupon) {
    await admin.from("coupons").update({ used_count: (Number((await admin.from("coupons").select("used_count").eq("code", coupon.toUpperCase()).single()).data?.used_count ?? 0) + 1) }).eq("code", coupon.toUpperCase());
  }

  // optional: Google Sheets webhook
  const webhook = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
  if (webhook) {
    try {
      await fetch(webhook, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          order_id: order.id,
          ebook_title: ebook.title,
          ebook_slug: ebook.slug,
          amount,
          utr,
          coupon: coupon ? coupon.toUpperCase() : null,
          affiliate: affiliateCode,
          user_email: auth.user.email,
          created_at: new Date().toISOString(),
        }),
      });
    } catch {}
  }

  const adminWa = process.env.ADMIN_WHATSAPP_NUMBER;
  const whatsAppUrl = adminWa
    ? `https://wa.me/${adminWa}?text=${encodeURIComponent(
        `New Order (Digital Arup)
OrderID: ${order.id}
Ebook: ${ebook.title}
Amount: ₹${amount}
UTR: ${utr}
Coupon: ${coupon ? coupon.toUpperCase() : "NA"}
Affiliate: ${affiliateCode ?? "NA"}
Buyer: ${auth.user.email ?? ""}`
      )}`
    : null;

  return NextResponse.json({ orderId: order.id, whatsAppUrl });
}
