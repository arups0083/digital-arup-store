"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { supabaseBrowser } from "@/lib/supabase/client";

export default function SignupPage() {
  const sb = supabaseBrowser();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function signup() {
    setMsg(null);
    setLoading(true);
    const { error } = await sb.auth.signUp({ email, password });
    setLoading(false);
    if (error) {
      setMsg(error.message);
      return;
    }
    router.push("/account");
  }

  return (
    <main className="card p-5 space-y-4">
      <h2 className="text-lg font-bold">Sign up</h2>
      <p className="text-sm text-slate-600">Email + password দিয়ে account তৈরি করুন।</p>
      <div>
        <label className="label">Email</label>
        <input className="input mt-2" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div>
        <label className="label">Password</label>
        <input className="input mt-2" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      <button className="btn-primary w-full" onClick={signup} disabled={loading}>{loading ? "..." : "Create account"}</button>
      {msg ? <p className="text-sm text-red-600">{msg}</p> : null}
      <p className="text-sm text-slate-600">
        Already have account? <Link className="underline" href="/auth/login">Login</Link>
      </p>
    </main>
  );
}
