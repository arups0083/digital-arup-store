# Digital Arup Ebook Store — Setup (Bangla)

## 0) কি কি লাগবে
- একটি Gmail
- Supabase (Free)
- Vercel (Free) — Next.js deploy
- (Optional) WhatsApp admin number
- (Optional) Google Sheet webhook (Apps Script)

---

## 1) Supabase Setup (Free)
1) supabase.com এ গিয়ে **New project** করুন  
2) Project তৈরি হলে: **Settings → API**
   - `Project URL` কপি করুন
   - `anon public` key কপি করুন
   - `service_role` key কপি করুন (এটা secret)

3) SQL Editor এ গিয়ে `supabase/schema.sql` ফাইলের পুরো কোড রান করুন।

---

## 2) Storage Buckets
Supabase Dashboard → Storage → Create bucket
- `covers` (private)
- `ebooks` (private)
- `payment_proofs` (private)

> Private রাখলেও সমস্যা নেই, কারণ আমাদের app signed URL দিয়ে দেখাবে/ডাউনলোড করাবে।

---

## 3) Admin বানানো (একবারই করতে হবে)
1) আপনার site এ গিয়ে signup করুন (আপনার email)  
2) Supabase → Table Editor → `profiles` টেবিল
3) আপনার user row এ গিয়ে `role` ফিল্ড `admin` করে দিন।

---

## 4) Env Variables (.env)
`.env.example` দেখে `.env.local` বানান এবং ভ্যালু বসান:

- NEXT_PUBLIC_SITE_NAME="Digital Arup"
- NEXT_PUBLIC_UPI_ID="9932342970-4@ybl"
- NEXT_PUBLIC_SUPABASE_URL=...
- NEXT_PUBLIC_SUPABASE_ANON_KEY=...
- SUPABASE_SERVICE_ROLE_KEY=...
- ADMIN_WHATSAPP_NUMBER=91XXXXXXXXXX (optional)
- GOOGLE_SHEETS_WEBHOOK_URL="" (optional)

---

## 5) Local run (PC থাকলে)
```bash
npm install
npm run dev
```
তারপর http://localhost:3000

---

## 6) Deploy (Free) — Vercel
1) GitHub এ এই code upload করুন
2) Vercel এ গিয়ে New Project → Import from GitHub
3) Environment Variables এ উপরোক্ত env বসিয়ে Deploy করুন।

---

## 7) Orders Google Sheet এ অটো সেভ (Optional)
Apps Script code `tools/google-sheets-webhook.gs` file এ আছে।
- Google Sheet খুলে Extensions → Apps Script
- কোড paste করে Deploy as Web App
- Web App URL `GOOGLE_SHEETS_WEBHOOK_URL` হিসেবে env এ বসান।

Done ✅
