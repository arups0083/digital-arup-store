import Image from "next/image";
import Link from "next/link";
import { cookies } from "next/headers";
import { supabaseServer } from "@/lib/supabase/server";
import { formatINR } from "@/lib/utils";
import { QRBlock } from "./qr";
import CouponApply from "./CouponApply";
import BuyForm from "./BuyForm";
import RefCookieSetter from "./ref-setter";

export const dynamic = "force-dynamic";

export default async function EbookPage({ params, searchParams }: { params: { slug: string }, searchParams: { ref?: string } }) {
  const sb = supabaseServer();
  const { data: ebook } = await sb.from("ebooks").select("*").eq("slug", params.slug).single();

  if (!ebook) {
    return (
      <main className="card p-6">
        <p className="text-sm text-slate-600">Ebook not found.</p>
        <Link href="/" className="btn-primary mt-3">Back</Link>
      </main>
    );
  }

  const { data: auth } = await sb.auth.getUser();
  const user = auth.user;

  const refCookie = cookies().get("da_ref")?.value ?? null;

  return (
    <main className="space-y-4">
      {/* Client-side cookie setter for ?ref=CODE */}
      <RefCookieSetter refCode={searchParams?.ref} />

      <div className="card overflow-hidden">
        <div className="relative aspect-[16/10] bg-slate-100">
          <Image
            src={ebook.cover_path ? `/api/cover?path=${encodeURIComponent(ebook.cover_path)}` : "/logo.svg"}
            alt={ebook.title}
            fill
            className="object-cover"
          />
        </div>
        <div className="p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl font-extrabold">{ebook.title}</h2>
            <span className="badge">{formatINR(Number(ebook.price))}</span>
          </div>
          {ebook.description ? <p className="mt-3 text-sm text-slate-700 whitespace-pre-line">{ebook.description}</p> : null}

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="badge">Manual UPI</span>
            <span className="badge">Lifetime access after approval</span>
            {refCookie ? <span className="badge">Ref: {refCookie}</span> : null}
          </div>
        </div>
      </div>

      {!user ? (
        <div className="card p-5">
          <p className="text-sm text-slate-700">কিনতে হলে আগে Login/Signup করতে হবে।</p>
          <Link href={`/auth/login?next=/ebook/${ebook.slug}`} className="btn-primary mt-3">Login</Link>
        </div>
      ) : (
        <>
          <div className="card p-5">
            <h3 className="text-base font-bold">Step 1: UPI Payment</h3>
            <p className="mt-1 text-sm text-slate-600">
              নিচের UPI ID তে পেমেন্ট করুন। তারপর UTR নম্বর দিয়ে Order Submit করুন।
            </p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 p-4">
                <p className="text-xs font-semibold text-slate-500">UPI ID</p>
                <p className="mt-1 break-all text-lg font-extrabold">{process.env.NEXT_PUBLIC_UPI_ID}</p>
                <p className="mt-2 text-sm text-slate-600">Amount: <span className="font-semibold">{formatINR(Number(ebook.price))}</span></p>
              </div>
              <div className="rounded-2xl border border-slate-200 p-4">
                <QRBlock upi={process.env.NEXT_PUBLIC_UPI_ID!} title={ebook.title} amount={Number(ebook.price)} />
              </div>
            </div>

            <div className="mt-4">
              <CouponApply ebookId={ebook.id} price={Number(ebook.price)} />
            </div>
          </div>

          <div className="card p-5">
            <h3 className="text-base font-bold">Step 2: Submit Order</h3>
            <p className="mt-1 text-sm text-slate-600">
              পেমেন্টের পরে UTR দিন। চাইলে screenshot দিন। Submit হলে order “Pending” থাকবে।
            </p>
            <BuyForm ebookId={ebook.id} baseAmount={Number(ebook.price)} />
          </div>
        </>
      )}
    </main>
  );
}
