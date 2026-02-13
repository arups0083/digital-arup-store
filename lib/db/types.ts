export type ProfileRole = "user" | "admin" | "affiliate";

export type Ebook = {
  id: string;
  title: string;
  slug: string;
  price: number;
  description: string | null;
  cover_path: string | null;
  pdf_path: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type OrderStatus = "pending" | "approved" | "rejected";

export type Order = {
  id: string;
  user_id: string;
  ebook_id: string;
  amount: number;
  coupon_code: string | null;
  utr: string;
  proof_path: string | null;
  status: OrderStatus;
  affiliate_code: string | null;
  created_at: string;
  updated_at: string;
};

export type Coupon = {
  id: string;
  code: string;
  type: "percent" | "fixed";
  value: number;
  expires_at: string | null;
  usage_limit: number | null;
  used_count: number;
  is_active: boolean;
  created_at: string;
};

export type Affiliate = {
  id: string;
  user_id: string;
  code: string;
  commission_rate: number;
  created_at: string;
};
