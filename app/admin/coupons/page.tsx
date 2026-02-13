"use client";

import { useEffect, useState } from "react";

export default function AdminCoupons() {
  const [list, setList] = useState<any[]>([]);
  const [code, setCode] = useState("");
  const [type, setType] = useState<"percent" | "fixed">("percent");
  const [value, setValue] = useState<number>(10);
  const [msg, setMsg] = useState<string | null>(null);

  async function load() {
    const res = await fetch("/api/admin/coupons/list");
    const data = await res.json();
    if (res.ok) setList(data.items ?? []);
  }

  useEffect(() => { load(); }, []);

  async function create() {
    setMsg(null);
    const res = await fetch("/api/admin/coupons/create", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ code, type, value }),
    });
    const data = await res.json();
    if (!res.ok) { setMsg(data?.error ?? "Error"); return; }
    setMsg("Created!");
    setCode("");
    await load();
  }

  return (
    <main className="space-y-4">
      <div className="card p-5">
        <h2 className="text-lg font-bold">Coupons</h2>
        <p className="mt-1 text-sm text-slate-600">Percent / Fixed coupons বানাও।</p>
      </div>

      <div className="card p-5 space-y-3">
        <div>
          <label className="label">Code</label>
          <input className="input mt-2" value={code} onChange={(e) => setCode(e.target.value)} placeholder="DA10" />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="label">Type</label>
            <select className="input mt-2" value={type} onChange={(e) => setType(e.target.value as any)}>
              <option value="percent">percent</option>
              <option value="fixed">fixed</option>
            </select>
          </div>
          <div>
            <label className="label">Value</label>
            <input className="input mt-2" type="number" value={value} onChange={(e) => setValue(Number(e.target.value))} />
          </div>
        </div>
        <button className="btn-primary" type="button" onClick={create}>Create</button>
        {msg ? <p className="text-sm text-slate-700">{msg}</p> : null}
      </div>

      <div className="card p-5">
        <h3 className="font-bold mb-3">Existing</h3>
        <div className="space-y-2">
          {list.map((c) => (
            <div key={c.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-200 p-3">
              <div>
                <p className="font-semibold">{c.code}</p>
                <p className="text-xs text-slate-500">{c.type} • {c.value} • used {c.used_count}</p>
              </div>
              <span className="badge">{c.is_active ? "active" : "off"}</span>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
