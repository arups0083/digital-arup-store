"use client";

import { useEffect, useMemo, useState } from "react";

export default function BuyForm({ ebookId, baseAmount }: { ebookId: string; baseAmount: number }) {
  const [utr, setUtr] = useState("");
  const [amount, setAmount] = useState<number>(baseAmount);
  const [coupon, setCoupon] = useState<string | null>(null);
  const [proof, setProof] = useState<File | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const c = sessionStorage.getItem("da_coupon_code");
    const a = sessionStorage.getItem("da_final_amount");
    if (c) setCoupon(c);
    if (a && !Number.isNaN(Number(a))) setAmount(Number(a));
  }, []);

  const payText = useMemo(() => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount), [amount]);

  async function submit() {
    setStatus(null);
    if (utr.trim().length < 6) {
      setStatus("UTR কমপক্ষে ৬ অক্ষর/ডিজিট দিন।");
      return;
    }
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("ebookId", ebookId);
      fd.append("amount", String(amount));
      fd.append("utr", utr.trim());
      if (coupon) fd.append("coupon", coupon);
      if (proof) fd.append("proof", proof);

      const res = await fetch("/api/order/create", { method: "POST", body: fd });
      const data = await res.json();

      if (!res.ok) {
        setStatus(data?.error ?? "Order submit হয়নি।");
        return;
      }

      setStatus(`Order Submitted! Order ID: ${data.orderId} (Pending)`);

      // Open WhatsApp chat (not automatic API; buyer sends message)
      if (data.whatsAppUrl) {
        window.open(data.whatsAppUrl, "_blank");
      }
    } catch (e: any) {
      setStatus(e?.message ?? "Error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-4 space-y-3">
      <div>
        <label className="label">Payable Amount</label>
        <input className="input mt-2" value={amount} onChange={(e) => setAmount(Number(e.target.value || baseAmount))} type="number" min={1} />
        <p className="mt-1 text-xs text-slate-500">You should pay exactly: {payText}</p>
      </div>

      <div>
        <label className="label">UTR / Transaction ID</label>
        <input className="input mt-2" value={utr} onChange={(e) => setUtr(e.target.value)} placeholder="e.g. 1234567890" />
      </div>

      <div>
        <label className="label">Payment Screenshot (optional)</label>
        <input className="input mt-2" type="file" accept="image/*" onChange={(e) => setProof(e.target.files?.[0] ?? null)} />
      </div>

      <button className="btn-primary w-full" type="button" onClick={submit} disabled={loading}>
        {loading ? "Submitting..." : "Submit Order"}
      </button>

      {status ? <p className="text-sm text-slate-700">{status}</p> : null}

      <p className="text-xs text-slate-500">
        Submit করার পর WhatsApp ওপেন হবে— সেখানে “Send” দিলে Admin সাথে সাথে অর্ডার পাবে।
      </p>
    </div>
  );
}
