"use client";

import { useEffect } from "react";

export default function RefCookieSetter({ refCode }: { refCode?: string }) {
  useEffect(() => {
    const code = (refCode ?? "").trim();
    if (!code) return;
    if (!/^[A-Za-z0-9_-]{3,32}$/.test(code)) return;
    // 30 days
    document.cookie = `da_ref=${encodeURIComponent(code)}; max-age=${60 * 60 * 24 * 30}; path=/`;
  }, [refCode]);

  return null;
}
