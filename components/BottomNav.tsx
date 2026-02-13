"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Truck, ShoppingBag, User } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { href: "/", label: "Home", icon: Home },
  { href: "/track", label: "Track", icon: Truck },
  { href: "/orders", label: "Order", icon: ShoppingBag },
  { href: "/account", label: "Profile", icon: User },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-3 left-0 right-0 z-40">
      <div className="container-app">
        <div className="mx-auto grid max-w-md grid-cols-4 gap-1 rounded-2xl bg-white shadow-lg ring-1 ring-slate-200">
          {items.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || (href !== "/" && pathname.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex flex-col items-center gap-1 rounded-2xl px-2 py-2 text-xs font-medium",
                  active ? "bg-slate-100 text-slate-900" : "text-slate-600 hover:bg-slate-50"
                )}
              >
                <Icon size={18} />
                {label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
