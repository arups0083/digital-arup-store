import { NextResponse } from "next/server";
import { z } from "zod";
import { supabaseServer } from "@/lib/supabase/server";

const schema = z.object({
  ebookId: z.string().uuid(),
  price: z.number().positive(),
  code: z.string().min(2).max(40),
});

export async function POST(req: Request) {
  const json = await req.json().catch(() => null);
  const parsed = schema.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  const { price, code } = parsed.data;

  const sb = supabaseServer();
  const { data: c, error } = await sb.from("coupons").select("*").eq("code", code.toUpperCase()).eq("is_active", true).maybeSingle();
  if (error || !c) return NextResponse.json({ error: "Invalid coupon" }, { status: 400 });

  if (c.expires_at && new Date(c.expires_at).getTime() < Date.now()) return NextResponse.json({ error: "Coupon expired" }, { status: 400 });
  if (c.usage_limit !== null && c.used_count >= c.usage_limit) return NextResponse.json({ error: "Coupon usage limit reached" }, { status: 400 });

  let finalAmount = price;
  if (c.type === "percent") {
    finalAmount = Math.max(1, Math.round(price - (price * Number(c.value) / 100)));
  } else {
    finalAmount = Math.max(1, Math.round(price - Number(c.value)));
  }

  return NextResponse.json({ finalAmount });
}
