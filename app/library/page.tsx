import Link from "next/link";
import { supabaseServer } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function LibraryPage() {
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
    .select("id, ebook_id, status, ebooks(title, slug)")
    .eq("user_id", auth.user.id)
    .eq("status", "approved")
    .order("created_at", { ascending: false });

  const items = (data ?? []) as any[];

  return (
    <main className="space-y-4">
      <div className="card p-4">
        <h2 className="text-lg font-bold">My Library</h2>
        <p className="mt-1 text-sm text-slate-600">শুধু Approved orders এখানে দেখাবে। Download button signed link দেয়।</p>
      </div>

      {items.length === 0 ? (
        <div className="card p-6 text-center text-sm text-slate-600">No approved purchases yet.</div>
      ) : (
        <div className="space-y-3">
          {items.map((i) => (
            <div key={i.id} className="card p-4">
              <div className="flex items-center justify-between gap-2">
                <p className="font-bold">{i.ebooks?.title ?? "Ebook"}</p>
                <span className="badge">Approved</span>
              </div>
              <p className="mt-1 text-xs text-slate-500">Order ID: {i.id}</p>

              <form action={`/api/download?ebookId=${encodeURIComponent(i.ebook_id)}`} method="get" className="mt-3">
                <button className="btn-primary" type="submit">Download</button>
              </form>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
