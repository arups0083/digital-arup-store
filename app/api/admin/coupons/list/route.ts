import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { supabaseAdmin } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const check = await requireAdmin();
  if (!check.ok) return NextResponse.json({ error: check.error }, { status: 401 });

  const admin = supabaseAdmin();
  const { data } = await admin.from("coupons").select("*").order("created_at", { ascending: false }).limit(100);
  return NextResponse.json({ items: data ?? [] });
}
