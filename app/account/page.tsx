import Link from "next/link";
import { supabaseServer } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const sb = supabaseServer();
  const { data: auth } = await sb.auth.getUser();
  const user = auth.user;

  if (!user) {
    return (
      <main className="card p-6">
        <p className="text-sm text-slate-600">Login করা নেই।</p>
        <Link href="/auth/login" className="btn-primary mt-3">Login</Link>
      </main>
    );
  }

  const { data: profile } = await sb.from("profiles").select("role, full_name").eq("id", user.id).single();
  const role = profile?.role ?? "user";

  return (
    <main className="space-y-4">
      <div className="card p-5">
        <h2 className="text-lg font-bold">My Profile</h2>
        <p className="mt-1 text-sm text-slate-600">Email: {user.email}</p>
        <p className="mt-1 text-sm text-slate-600">Role: <span className="badge">{role}</span></p>
      </div>

      <div className="card divide-y divide-slate-200">
        <Link href="/orders" className="block px-5 py-4 text-sm hover:bg-slate-50">My Orders</Link>
        <Link href="/library" className="block px-5 py-4 text-sm hover:bg-slate-50">My Library (Downloads)</Link>
        <Link href="/affiliate" className="block px-5 py-4 text-sm hover:bg-slate-50">Affiliate</Link>
        {role === "admin" ? <Link href="/admin" className="block px-5 py-4 text-sm hover:bg-slate-50">Admin Panel</Link> : null}
      </div>
    </main>
  );
}
