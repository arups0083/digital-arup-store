import Link from "next/link";

const items = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/affiliate", label: "Affiliate" },
  { href: "/blog", label: "Blog" },
  { href: "/faq", label: "FAQ" },
  { href: "/about", label: "About Us" },
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms & Service" },
  { href: "/refund", label: "Refund & Return" },
  { href: "/shipping", label: "Shipping Rules" },
  { href: "/contact", label: "Contact" },
];

export default function MenuPage() {
  return (
    <main className="card overflow-hidden">
      <div className="bg-slate-900 px-4 py-3 text-white">
        <h2 className="text-base font-bold">Menu</h2>
      </div>
      <div className="divide-y divide-slate-200">
        {items.map((i) => (
          <Link key={i.href} href={i.href} className="block px-4 py-3 text-sm hover:bg-slate-50">
            {i.label}
          </Link>
        ))}
      </div>
    </main>
  );
}
