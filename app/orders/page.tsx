import Link from "next/link";
import { supabaseServer } from "@/lib/supabase/server";
export const dynamic = "force-dynamic";

export default async function OrdersPage() {
  const sb = supabaseServer();
  const { data: auth } = await sb.auth.getUser();
  if (!auth.user) {
    return (
      <main className="card p-6">
        <p className="text-sm text-slate-600">Login করতে হবে।</p>
        <Link href="/auth/login" className="btn-primary mt-3">Login</Link>
      </main>
    );
  }

  const { data } = await sb
    .from("orders")
    .select("*, ebooks(title, slug)")
    .eq("user_id", auth.user.id)
    .order("created_at", { ascending: false });

  const orders = (data ?? []) as any[];

  return (
    <main className="space-y-4">
      <div className="card p-4">
        <h2 className="text-lg font-bold">My Orders</h2>
        <p className="mt-1 text-sm text-slate-600">Pending → Admin approve/reject করবে। Approved হলে Library থেকে ডাউনলোড।</p>
      </div>

      {orders.length === 0 ? (
        <div className="card p-6 text-center text-sm text-slate-600">No orders yet.</div>
      ) : (
        <div className="space-y-3">
          {orders.map((o) => (
            <div key={o.id} className="card p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-bold">{o.ebooks?.title ?? "Ebook"}</p>
                <span className="badge">{o.status}</span>
              </div>
              <p className="mt-1 text-xs text-slate-500">Order ID: {o.id}</p>
              <p className="mt-2 text-sm text-slate-600">UTR: {o.utr}</p>
              <p className="mt-1 text-sm text-slate-600">Amount: ₹{o.amount}</p>
              <p className="mt-1 text-xs text-slate-500">Created: {new Date(o.created_at).toLocaleString()}</p>
              {o.status === "approved" ? (
                <Link href="/library" className="btn-primary mt-3">Go to Library</Link>
              ) : null}
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
