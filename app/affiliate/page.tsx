import Link from "next/link";
import { supabaseServer } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function AffiliatePage() {
  const sb = supabaseServer();
  const { data: auth } = await sb.auth.getUser();
  if (!auth.user) {
    return (
      <main className="card p-6">
        <p className="text-sm text-slate-600">Affiliate হতে Login করতে হবে।</p>
        <Link href="/auth/login?next=/affiliate" className="btn-primary mt-3">Login</Link>
      </main>
    );
  }

  const { data: aff } = await sb.from("affiliates").select("*").eq("user_id", auth.user.id).maybeSingle();

  return (
    <main className="space-y-4">
      <div className="card p-5">
        <h2 className="text-lg font-bold">Affiliate</h2>
        <p className="mt-1 text-sm text-slate-600">আপনার referral link শেয়ার করুন: /ebook/[slug]?ref=CODE</p>
      </div>

      {aff ? (
        <div className="card p-5 space-y-2">
          <p className="text-sm">Your Code: <span className="badge">{aff.code}</span></p>
          <p className="text-sm text-slate-600">Commission: {aff.commission_rate}%</p>
          <p className="text-xs text-slate-500">যে কেউ আপনার link দিয়ে কিনলে Order এ affiliate code save হবে (Admin panel এ দেখা যাবে)।</p>
        </div>
      ) : (
        <form action="/api/affiliate/create" method="post" className="card p-5 space-y-3">
          <p className="text-sm text-slate-700">আপনি এখনো Affiliate নন। নিচে ক্লিক করে code তৈরি করুন।</p>
          <button className="btn-primary" type="submit">Become an Affiliate</button>
        </form>
      )}
    </main>
  );
}
