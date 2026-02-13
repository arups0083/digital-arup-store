import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const orderId = url.searchParams.get("orderId");
  if (!orderId) return NextResponse.json({ error: "Missing orderId" }, { status: 400 });

  const sb = supabaseServer();
  const { data: auth } = await sb.auth.getUser();
  if (!auth.user) return NextResponse.json({ error: "Login required" }, { status: 401 });

  const { data: order } = await sb.from("orders").select("status, amount, ebooks(title)").eq("id", orderId).eq("user_id", auth.user.id).single();
  if (!order) return NextResponse.json({ error: "Not found" }, { status: 404 });

 const ebookTitle =
  Array.isArray((order as any).ebooks)
    ? ((order as any).ebooks[0]?.title ?? "")
    : ((order as any).ebooks?.title ?? "");

return NextResponse.json({
  status: order.status,
  amount: order.amount,
  ebookTitle,
});
}
