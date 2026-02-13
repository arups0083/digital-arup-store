import Link from "next/link";
import Image from "next/image";
import { supabaseServer } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export default async function AdminOrders() {
  const sb = supabaseServer();
  const { data: auth } = await sb.auth.getUser();
  if (!auth.user) return <main className="card p-6 text-sm text-slate-600">Login required.</main>;
  const { data: profile } = await sb.from("profiles").select("role").eq("id", auth.user.id).single();
  if (profile?.role !== "admin") return <main className="card p-6 text-sm text-slate-600">Not admin.</main>;

  const admin = supabaseAdmin();
  const { data: orders } = await admin
    .from("orders")
    .select("*, ebooks(title)")
    .order("created_at", { ascending: false })
    .limit(50);

  return (
    <main className="space-y-4">
      <div className="card p-5">
        <h2 className="text-lg font-bold">Orders</h2>
        <p className="mt-1 text-sm text-slate-600">Approve করলে user এর Library তে ebook যাবে।</p>
      </div>

      <div className="space-y-3">
        {(orders ?? []).map((o: any) => (
          <div key={o.id} className="card p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-bold">{o.ebooks?.title ?? "Ebook"}</p>
              <span className="badge">{o.status}</span>
            </div>
            <p className="mt-1 text-xs text-slate-500">Order ID: {o.id}</p>
            <p className="mt-2 text-sm text-slate-600">Amount: ₹{o.amount} • UTR: {o.utr}</p>
            {o.coupon_code ? <p className="mt-1 text-xs text-slate-500">Coupon: {o.coupon_code}</p> : null}
            {o.affiliate_code ? <p className="mt-1 text-xs text-slate-500">Affiliate: {o.affiliate_code}</p> : null}

            {o.proof_path ? (
              <div className="mt-3">
                <p className="text-xs text-slate-500 mb-2">Proof:</p>
                <div className="relative h-40 w-full overflow-hidden rounded-xl bg-slate-100 ring-1 ring-slate-200">
                  <Image src={`/api/proof?path=${encodeURIComponent(o.proof_path)}`} alt="proof" fill className="object-cover" />
                </div>
              </div>
            ) : null}

            <div className="mt-3 flex flex-wrap gap-2">
              <form action="/api/admin/orders/update" method="post">
                <input type="hidden" name="id" value={o.id} />
                <input type="hidden" name="status" value="approved" />
                <button className="btn-primary" type="submit">Approve</button>
              </form>
              <form action="/api/admin/orders/update" method="post">
                <input type="hidden" name="id" value={o.id} />
                <input type="hidden" name="status" value="rejected" />
                <button className="btn-ghost" type="submit">Reject</button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
