import Link from "next/link";
import { supabaseServer } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export default async function AdminEbooks() {
  const sb = supabaseServer();
  const { data: auth } = await sb.auth.getUser();
  if (!auth.user) {
    return (
      <main className="card p-6">
        <p className="text-sm text-slate-600">Login required.</p>
        <Link href="/auth/login?next=/admin/ebooks" className="btn-primary mt-3">Login</Link>
      </main>
    );
  }
  const { data: profile } = await sb.from("profiles").select("role").eq("id", auth.user.id).single();
  if (profile?.role !== "admin") return <main className="card p-6 text-sm text-slate-600">Not admin.</main>;

  const admin = supabaseAdmin();
  const { data: ebooks } = await admin.from("ebooks").select("*").order("created_at", { ascending: false });

  return (
    <main className="space-y-4">
      <div className="card p-5 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold">Ebooks</h2>
          <p className="text-sm text-slate-600">Add/edit এখানে</p>
        </div>
        <Link href="/admin/ebooks/new" className="btn-primary">+ Add Ebook</Link>
      </div>

      <div className="space-y-3">
        {(ebooks ?? []).map((e: any) => (
          <div key={e.id} className="card p-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-bold">{e.title}</p>
              <p className="text-xs text-slate-500">Slug: {e.slug} • Price: ₹{e.price}</p>
              <p className="mt-1 text-xs">{e.is_active ? <span className="badge">Active</span> : <span className="badge">Hidden</span>}</p>
            </div>
            <div className="flex gap-2">
              <Link className="btn-ghost" href={`/ebook/${e.slug}`} target="_blank">View</Link>
              <Link className="btn-primary" href={`/admin/ebooks/${e.id}`}>Edit</Link>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
