"use client";

import { useState } from "react";

export default function TrackPage() {
  const [orderId, setOrderId] = useState("");
  const [result, setResult] = useState<any>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function track() {
    setMsg(null);
    setResult(null);
    if (orderId.trim().length < 8) {
      setMsg("Order ID ঠিকমতো দিন।");
      return;
    }
    setLoading(true);
    const res = await fetch(`/api/order/status?orderId=${encodeURIComponent(orderId.trim())}`);
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setMsg(data?.error ?? "Not found");
      return;
    }
    setResult(data);
  }

  return (
    <main className="space-y-4">
      <div className="card p-4">
        <h2 className="text-lg font-bold">Track Order</h2>
        <p className="mt-1 text-sm text-slate-600">অর্ডার স্ট্যাটাস দেখতে Order ID দিন (Login থাকা লাগবে)।</p>
        <input className="input mt-3" placeholder="Order ID" value={orderId} onChange={(e) => setOrderId(e.target.value)} />
        <button className="btn-primary mt-3 w-full" onClick={track} disabled={loading}>{loading ? "..." : "Check status"}</button>
        {msg ? <p className="mt-2 text-sm text-red-600">{msg}</p> : null}
      </div>

      {result ? (
        <div className="card p-4">
          <p className="text-sm"><span className="font-semibold">Status:</span> {result.status}</p>
          <p className="mt-1 text-sm"><span className="font-semibold">Ebook:</span> {result.ebookTitle}</p>
          <p className="mt-1 text-sm"><span className="font-semibold">Amount:</span> ₹{result.amount}</p>
        </div>
      ) : null}
    </main>
  );
}
