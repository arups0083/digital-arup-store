import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const path = url.searchParams.get("path");
  if (!path) return NextResponse.json({ error: "Missing path" }, { status: 400 });

  const sb = supabaseAdmin();
  const { data, error } = await sb.storage.from("payment_proofs").createSignedUrl(path, 60 * 10);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.redirect(data.signedUrl);
}
