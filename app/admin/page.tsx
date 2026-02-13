import Link from "next/link";
import { supabaseServer } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function AdminHome() {
  const sb = supabaseServer();
  const { data: auth } = await sb.auth.getUser();
  if (!auth.user) {
    return (
      <main className="card p-6">
        <p className="text-sm text-slate-600">Admin panel access করতে Login করতে হবে।</p>
        <Link href="/auth/login?next=/admin" className="btn-primary mt-3">Login</Link>
      </main>
    );
  }
  const { data: profile } = await sb.from("profiles").select("role").eq("id", auth.user.id).single();
  if (profile?.role !== "admin") {
    return (
      <main className="card p-6">
        <p className="text-sm text-slate-600">আপনি Admin নন। Supabase Table Editor এ profiles টেবিলে role = admin করুন।</p>
      </main>
    );
  }

  return (
    <main className="space-y-4">
      <div className="card p-5">
        <h2 className="text-lg font-bold">Admin Panel</h2>
        <p className="mt-1 text-sm text-slate-600">Ebook add/edit, Orders approve, Coupons, Affiliates</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Link href="/admin/ebooks" className="card p-5 hover:bg-slate-50">
          <p className="font-bold">Manage Ebooks</p>
          <p className="mt-1 text-sm text-slate-600">Add / edit / activate-deactivate</p>
        </Link>
        <Link href="/admin/orders" className="card p-5 hover:bg-slate-50">
          <p className="font-bold">Manage Orders</p>
          <p className="mt-1 text-sm text-slate-600">Approve / Reject + proofs</p>
        </Link>
        <Link href="/admin/coupons" className="card p-5 hover:bg-slate-50">
          <p className="font-bold">Coupons</p>
          <p className="mt-1 text-sm text-slate-600">Create codes (percent/fixed)</p>
        </Link>
        <Link href="/admin/affiliates" className="card p-5 hover:bg-slate-50">
          <p className="font-bold">Affiliates</p>
          <p className="mt-1 text-sm text-slate-600">View codes & orders</p>
        </Link>
      </div>
    </main>
  );
}
