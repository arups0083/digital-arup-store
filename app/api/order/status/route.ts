import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type OrderWithEmbed = {
  status: string | null;
  amount: number | null;
  // ebooks কখনো array, কখনো object হতে পারে relation অনুযায়ী — তাই দুটোই ধরলাম
  ebooks?: { title: string | null }[] | { title: string | null } | null;
};

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const orderId = url.searchParams.get("orderId");
    if (!orderId) {
      return NextResponse.json({ error: "Missing orderId" }, { status: 400 });
    }

    const sb = supabaseServer();

    const { data: authData, error: authError } = await sb.auth.getUser();
    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 401 });
    }
    if (!authData.user) {
      return NextResponse.json({ error: "Login required" }, { status: 401 });
    }

    const { data, error } = await sb
      .from("orders")
      .select("status, amount, ebooks(title)")
      .eq("id", orderId)
      .eq("user_id", authData.user.id)
      .maybeSingle();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    if (!data) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const order = data as unknown as OrderWithEmbed;

    let ebookTitle = "";
    const embedded = order.ebooks;

    if (Array.isArray(embedded)) {
      ebookTitle = embedded?.[0]?.title ?? "";
    } else if (embedded && typeof embedded === "object") {
      ebookTitle = (embedded as any).title ?? "";
    }

    return NextResponse.json({
      status: order.status ?? "",
      amount:
