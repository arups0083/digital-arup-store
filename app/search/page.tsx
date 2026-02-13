"use client";

import { useEffect, useMemo, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase/client";
import type { Ebook } from "@/lib/db/types";
import EbookCard from "@/components/EbookCard";

export default function SearchPage() {
  const [q, setQ] = useState("");
  const [items, setItems] = useState<Ebook[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const sb = supabaseBrowser();
      const { data } = await sb.from("ebooks").select("*").eq("is_active", true).order("created_at", { ascending: false });
      setItems((data ?? []) as Ebook[]);
      setLoading(false);
    })();
  }, []);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return items;
    return items.filter((e) => (e.title ?? "").toLowerCase().includes(s) || (e.description ?? "").toLowerCase().includes(s));
  }, [q, items]);

  return (
    <main className="space-y-4">
      <div className="card p-4">
        <label className="label">Search</label>
        <input className="input mt-2" placeholder="ebook name..." value={q} onChange={(e) => setQ(e.target.value)} />
        <p className="mt-2 text-xs text-slate-500">মোট: {filtered.length}</p>
      </div>

      {loading ? (
        <div className="card p-6 text-center text-sm text-slate-600">Loading...</div>
      ) : (
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {filtered.map((ebook) => (
            <EbookCard key={ebook.id} ebook={ebook} />
          ))}
        </section>
      )}
    </main>
  );
}
