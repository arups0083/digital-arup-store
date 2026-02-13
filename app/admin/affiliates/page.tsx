import { supabaseServer } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export default async function AdminAffiliates() {
  const sb = supabaseServer();
  const { data: auth } = await sb.auth.getUser();
  if (!auth.user) return <main className="card p-6 text-sm text-slate-600">Login required.</main>;
  const { data: profile } = await sb.from("profiles").select("role").eq("id", auth.user.id).single();
  if (profile?.role !== "admin") return <main className="card p-6 text-sm text-slate-600">Not admin.</main>;

  const admin = supabaseAdmin();

  const { data: affiliates } = await admin.from("affiliates").select("*").order("created_at", { ascending: false });

  const { data: recentOrders } = await admin
    .from("orders")
    .select("id, affiliate_code, amount, status, created_at")
    .not("affiliate_code", "is", null)
    .order("created_at", { ascending: false })
    .limit(30);

  return (
    <main className="space-y-4">
      <div className="card p-5">
        <h2 className="text-lg font-bold">Affiliates</h2>
        <p className="text-sm text-slate-600 mt-1">Codes & last affiliate orders</p>
      </div>

      <div className="card p-5">
        <h3 className="font-bold mb-3">Codes</h3>
        <div className="space-y-2">
          {(affiliates ?? []).map((a: any) => (
            <div key={a.id} className="flex items-center justify-between rounded-xl border border-slate-200 p-3">
              <div>
                <p className="font-semibold">{a.code}</p>
                <p className="text-xs text-slate-500">rate: {a.commission_rate}%</p>
              </div>
              <span className="badge">{new Date(a.created_at).toLocaleDateString()}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="card p-5">
        <h3 className="font-bold mb-3">Recent Affiliate Orders</h3>
        <div className="space-y-2">
          {(recentOrders ?? []).map((o: any) => (
            <div key={o.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-200 p-3">
              <div>
                <p className="text-sm font-semibold">Order: {o.id.slice(0, 8)}…</p>
                <p className="text-xs text-slate-500">Affiliate: {o.affiliate_code} • ₹{o.amount} • {o.status}</p>
              </div>
              <span className="badge">{new Date(o.created_at).toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
