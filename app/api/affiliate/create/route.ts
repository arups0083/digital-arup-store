import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

function makeCode(userId: string) {
  // short deterministic-ish code
  return ("DA" + userId.replace(/-/g, "").slice(0, 8)).toUpperCase();
}

export async function POST(req: Request) {
  const sb = supabaseServer();
  const { data: auth } = await sb.auth.getUser();
  if (!auth.user) return NextResponse.redirect(new URL("/auth/login?next=/affiliate", req.url));

  const admin = supabaseAdmin();

  const { data: existing } = await admin.from("affiliates").select("id, code").eq("user_id", auth.user.id).maybeSingle();
  if (existing) return NextResponse.redirect(new URL("/affiliate", req.url));

  const code = makeCode(auth.user.id);

  await admin.from("affiliates").insert({
    user_id: auth.user.id,
    code,
    commission_rate: 30,
  });

  return NextResponse.redirect(new URL("/affiliate", req.url));
}
