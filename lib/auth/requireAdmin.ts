import { supabaseServer } from "@/lib/supabase/server";

export async function requireAdmin() {
  const sb = supabaseServer();
  const { data: auth } = await sb.auth.getUser();
  if (!auth.user) return { ok: false as const, error: "Not logged in" };
  const { data: profile } = await sb.from("profiles").select("role").eq("id", auth.user.id).single();
  if (profile?.role !== "admin") return { ok: false as const, error: "Not admin" };
  return { ok: true as const, userId: auth.user.id };
}
