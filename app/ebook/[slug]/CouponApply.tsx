"use client";

import { useMemo, useState } from "react";
import { z } from "zod";

const schema = z.object({ code: z.string().min(2).max(40) });

export default function CouponApply({ ebookId, price }: { ebookId: string; price: number }) {
  const [code, setCode] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [finalAmount, setFinalAmount] = useState<number>(price);

  const formatted = useMemo(() => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(finalAmount), [finalAmount]);

  async function apply() {
    setMsg(null);
    const parsed = schema.safeParse({ code });
    if (!parsed.success) {
      setMsg("Coupon code ঠিক নেই।");
      return;
    }
    const res = await fetch("/api/coupon/validate", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ ebookId, price, code: parsed.data.code }),
    });
    const data = await res.json();
    if (!res.ok) {
      setMsg(data?.error ?? "Coupon apply হয়নি।");
      return;
    }
    setFinalAmount(data.finalAmount);
    setMsg(`Applied! Pay: ₹${data.finalAmount}`);
    sessionStorage.setItem("da_coupon_code", parsed.data.code);
    sessionStorage.setItem("da_final_amount", String(data.finalAmount));
  }

  function clear() {
    setMsg(null);
    setFinalAmount(price);
    setCode("");
    sessionStorage.removeItem("da_coupon_code");
    sessionStorage.removeItem("da_final_amount");
  }

  return (
    <div className="rounded-2xl border border-slate-200 p-4">
      <p className="text-sm font-bold">Have a coupon?</p>
      <div className="mt-2 flex gap-2">
        <input className="input" value={code} onChange={(e) => setCode(e.target.value)} placeholder="COUPON2026" />
        <button className="btn-primary whitespace-nowrap" type="button" onClick={apply}>Apply</button>
        <button className="btn-ghost whitespace-nowrap" type="button" onClick={clear}>Clear</button>
      </div>
      <p className="mt-2 text-sm text-slate-700">Final Payable: <span className="font-extrabold">{formatted}</span></p>
      {msg ? <p className="mt-1 text-sm text-slate-600">{msg}</p> : null}
      <p className="mt-2 text-xs text-slate-500">Coupon successful হলে নিচের Order Submit এ auto amount চলে যাবে।</p>
    </div>
  );
}
