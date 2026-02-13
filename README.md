# Digital Arup — Ebook Store (Next.js + Supabase) ✅

Features:
- Admin: add/edit/delete ebooks (cover + PDF upload), hide/unhide
- Manual UPI payment (UPI ID + QR)
- User login/signup (Supabase Auth)
- Order submit (UTR + optional screenshot) → status pending
- Admin approve/reject
- On approval: user gets lifetime download in My Library (signed URLs)
- Coupons (percent / fixed)
- Affiliate: user can create a referral code, link like /ebook/[slug]?ref=CODE

Free hosting:
- Vercel (recommended) or Cloudflare Pages (advanced)

Setup guide:
- See `SETUP_BN.md`

Security note:
- `SUPABASE_SERVICE_ROLE_KEY` must be server-side only (Vercel env). Never expose it to client.
