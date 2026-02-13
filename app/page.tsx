import EbookCard from "@/components/EbookCard";
import { supabaseServer } from "@/lib/supabase/server";
import type { Ebook } from "@/lib/db/types";

export default async function HomePage() {
  const sb = supabaseServer();
  const { data, error } = await sb
    .from("ebooks")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  const ebooks = (data ?? []) as Ebook[];

  return (
    <main className="space-y-4">
      <div className="card p-4">
        <h2 className="text-lg font-bold">Available Ebooks</h2>
        <p className="mt-1 text-sm text-slate-600">
          পেমেন্ট হবে UPI দিয়ে। পেমেন্টের পর UTR দিয়ে সাবমিট করলে Admin approve করবে — তারপর “My Library” থেকে ডাউনলোড।
        </p>
        {error ? <p className="mt-2 text-sm text-red-600">Error: {error.message}</p> : null}
      </div>

      {ebooks.length === 0 ? (
        <div className="card p-6 text-center">
          <p className="text-sm text-slate-600">এখনো কোনো ebook যোগ করা হয়নি।</p>
          <p className="mt-2 text-xs text-slate-500">Admin panel থেকে ebook add করো: /admin</p>
        </div>
      ) : (
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {ebooks.map((ebook) => (
            <EbookCard key={ebook.id} ebook={ebook} />
          ))}
        </section>
      )}
    </main>
  );
}
