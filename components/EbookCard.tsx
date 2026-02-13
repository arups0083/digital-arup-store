import Link from "next/link";
import Image from "next/image";
import { formatINR } from "@/lib/utils";
import type { Ebook } from "@/lib/db/types";

export default function EbookCard({ ebook }: { ebook: Ebook }) {
  return (
    <div className="card overflow-hidden">
      <div className="relative aspect-[16/10] bg-slate-100">
        <Image
          src={ebook.cover_path ? `/api/cover?path=${encodeURIComponent(ebook.cover_path)}` : "/logo.svg"}
          alt={ebook.title}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-base font-bold leading-snug">{ebook.title}</h3>
          <span className="badge">{formatINR(Number(ebook.price))}</span>
        </div>
        {ebook.description ? (
          <p className="mt-2 line-clamp-2 text-sm text-slate-600">{ebook.description}</p>
        ) : null}
        <div className="mt-4 flex items-center gap-2">
          <Link href={`/ebook/${ebook.slug}`} className="btn-primary w-full">View & Buy</Link>
        </div>
      </div>
    </div>
  );
}
