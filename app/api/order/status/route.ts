import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const orderId = url.searchParams.get("orderId");

  if (!orderId) {
    return NextResponse.json({ error: "Missing orderId" }, { status: 400 });
  }

  const sb = supabaseServer();

  const { data: auth, error: authError } = await sb.auth.getUser();
  if (authError) console.error(authError);

  const user = auth?.user;
  if (!user) {
    return NextResponse.json({ error: "Login required" }, { status: 401 });
  }

  const { data: order, error: orderError } = await sb
    .from("orders")
    .select("status, amount, ebooks(title)")
    .eq("id", orderId)
    .eq("user_id", user.id)
    .single();

  if (orderError || !order) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // ✅ ebooks relation object অথবা array—দুইটাই handle করছি
  const ebooksRel = (order as any).ebooks;

  const ebookTitle = Array.isArray(ebooksRel)
    ? (ebooksRel[0]?.title ?? "")
    : (ebooksRel?.title ?? "");

  return NextResponse.json({
    status: (order as any).status,
    amount: (order as any).amount,
    ebookTitle,
  });
}
