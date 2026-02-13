import type { Metadata } from "next";
import "./globals.css";
import TopBar from "@/components/TopBar";
import BottomNav from "@/components/BottomNav";
import AuthButtons from "@/components/AuthButtons";

export const metadata: Metadata = {
  title: "Digital Arup – Ebook Store",
  description: "Sell and deliver ebooks with manual UPI payments.",
  icons: [{ rel: "icon", url: "/favicon.svg" }],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="bn">
      <body>
        <TopBar />
        <div className="container-app py-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h1 className="text-xl font-extrabold">Digital Arup</h1>
              <p className="text-sm text-slate-600">Ebook Store • UPI Payment</p>
            </div>
            {/* @ts-expect-error Async Server Component */}
            <AuthButtons />
          </div>
          {children}
        </div>
        <div className="h-24" />
        <BottomNav />
      </body>
    </html>
  );
}
