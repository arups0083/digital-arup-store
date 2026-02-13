"use client";

import { useState } from "react";

export default function NewEbookPage() {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState<number>(99);
  const [description, setDescription] = useState("");
  const [cover, setCover] = useState<File | null>(null);
  const [pdf, setPdf] = useState<File | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function create() {
    setMsg(null);
    if (!title.trim()) { setMsg("Title required"); return; }
    if (!pdf) { setMsg("PDF required"); return; }
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("title", title.trim());
      fd.append("price", String(price));
      fd.append("description", description);
      if (cover) fd.append("cover", cover);
      fd.append("pdf", pdf);

      const res = await fetch("/api/admin/ebooks/create", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) { setMsg(data?.error ?? "Error"); return; }
      setMsg("Created! Now go back.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="card p-5 space-y-4">
      <h2 className="text-lg font-bold">Add Ebook</h2>
      <div>
        <label className="label">Title</label>
        <input className="input mt-2" value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>
      <div>
        <label className="label">Price (INR)</label>
        <input className="input mt-2" type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))} />
      </div>
      <div>
        <label className="label">Description</label>
        <textarea className="input mt-2 min-h-[120px]" value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>
      <div>
        <label className="label">Cover Image (optional)</label>
        <input className="input mt-2" type="file" accept="image/*" onChange={(e) => setCover(e.target.files?.[0] ?? null)} />
      </div>
      <div>
        <label className="label">PDF File</label>
        <input className="input mt-2" type="file" accept="application/pdf" onChange={(e) => setPdf(e.target.files?.[0] ?? null)} />
      </div>

      <button className="btn-primary w-full" onClick={create} disabled={loading}>{loading ? "..." : "Create Ebook"}</button>
      {msg ? <p className="text-sm text-slate-700">{msg}</p> : null}
      <p className="text-xs text-slate-500">Note: Admin role না থাকলে কাজ করবে না।</p>
    </main>
  );
}
