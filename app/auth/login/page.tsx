"use client";

import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import { supabaseBrowser } from "@/lib/supabase/client";

export default function LoginPage() {
  const sb = supabaseBrowser();
  const params = useSearchParams();
  const next = params.get("next") ?? "/account";
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function login() {
    setMsg(null);
    setLoading(true);
    const { error } = await sb.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setMsg(error.message);
      return;
    }
    router.push(next);
  }

  return (
    <main className="card p-5 space-y-4">
      <h2 className="text-lg font-bold">Login</h2>
      <div>
        <label className="label">Email</label>
        <input className="input mt-2" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div>
        <label className="label">Password</label>
        <input className="input mt-2" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      <button className="btn-primary w-full" onClick={login} disabled={loading}>{loading ? "..." : "Login"}</button>
      {msg ? <p className="text-sm text-red-600">{msg}</p> : null}
      <p className="text-sm text-slate-600">
        New? <Link className="underline" href="/auth/signup">Create account</Link>
      </p>
    </main>
  );
}
