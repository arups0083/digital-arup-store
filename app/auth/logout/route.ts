import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const sb = supabaseServer();
  await sb.auth.signOut();
  return NextResponse.redirect(new URL("/", req.url));
}
