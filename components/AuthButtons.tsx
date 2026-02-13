import Link from "next/link";
import { supabaseServer } from "@/lib/supabase/server";

export default async function AuthButtons() {
  const sb = supabaseServer();
  const { data } = await sb.auth.getUser();

  if (data.user) {
    return (
      <div className="flex items-center gap-2">
        <Link href="/account" className="btn-ghost">Account</Link>
        <form action="/auth/logout" method="post">
          <button className="btn-ghost" type="submit">Logout</button>
        </form>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Link href="/auth/login" className="btn-ghost">Login</Link>
      <Link href="/auth/signup" className="btn-primary">Sign up</Link>
    </div>
  );
}
