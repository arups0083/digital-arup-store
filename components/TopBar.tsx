import Link from "next/link";
import Image from "next/image";
import { Search, ShoppingCart, Menu } from "lucide-react";

export default function TopBar() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="container-app flex items-center gap-3 py-3">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.svg" alt="Digital Arup" width={160} height={48} priority />
        </Link>
        <div className="ml-auto flex items-center gap-2">
          <Link href="/search" className="btn-ghost" aria-label="Search"><Search size={18} /></Link>
          <Link href="/orders" className="btn-ghost" aria-label="Orders"><ShoppingCart size={18} /></Link>
          <Link href="/menu" className="btn-ghost" aria-label="Menu"><Menu size={18} /></Link>
        </div>
      </div>
    </header>
  );
}
