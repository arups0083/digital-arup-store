"use client";

import { useEffect, useState } from "react";

export default function EditEbookPage({ params }: { params: { id: string } }) {
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState<number>(99);
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [cover, setCover] = useState<File | null>(null);
  const [pdf, setPdf] = useState<File | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const res = await fetch(`/api/admin/ebooks/get?id=${encodeURIComponent(params.id)}`);
      const data = await res.json();
      setLoading(false);
      if (!res.ok) { setMsg(data?.error ?? "Error"); return; }
      setTitle(data.title);
      setPrice(data.price);
      setDescription(data.description ?? "");
      setIsActive(Boolean(data.is_active));
    })();
  }, [params.id]);

  async function save() {
    setMsg(null);
    const fd = new FormData();
    fd.append("id", params.id);
    fd.append("title", title);
    fd.append("price", String(price));
    fd.append("description", description);
    fd.append("is_active", String(isActive));
    if (cover) fd.append("cover", cover);
    if (pdf) fd.append("pdf", pdf);

    const res = await fetch("/api/admin/ebooks/update", { method: "POST", body: fd });
    const data = await res.json();
    if (!res.ok) { setMsg(data?.error ?? "Error"); return; }
    setMsg("Saved!");
  }

  async function remove() {
    if (!confirm("Delete this ebook?")) return;
    const res = await fetch("/api/admin/ebooks/delete", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ id: params.id })});
    const data = await res.json();
    if (!res.ok) { setMsg(data?.error ?? "Error"); return; }
    setMsg("Deleted! Go back.");
  }

  if (loading) return <main className="card p-6 text-sm text-slate-600">Loading...</main>;

  return (
    <main className="card p-5 space-y-4">
      <h2 className="text-lg font-bold">Edit Ebook</h2>

      <div>
        <label className="label">Title</label>
        <input className="input mt-2" value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>
      <div>
        <label className="label">Price</label>
        <input className="input mt-2" type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))} />
      </div>
      <div>
        <label className="label">Description</label>
        <textarea className="input mt-2 min-h-[120px]" value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>
      <div className="flex items-center gap-3">
        <input id="active" type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
        <label htmlFor="active" className="text-sm">Active (show on store)</label>
      </div>
      <div>
        <label className="label">Replace Cover (optional)</label>
        <input className="input mt-2" type="file" accept="image/*" onChange={(e) => setCover(e.target.files?.[0] ?? null)} />
      </div>
      <div>
        <label className="label">Replace PDF (optional)</label>
        <input className="input mt-2" type="file" accept="application/pdf" onChange={(e) => setPdf(e.target.files?.[0] ?? null)} />
      </div>

      <div className="flex gap-2">
        <button className="btn-primary" onClick={save}>Save</button>
        <button className="btn-ghost" onClick={remove}>Delete</button>
      </div>

      {msg ? <p className="text-sm text-slate-700">{msg}</p> : null}
    </main>
  );
}
