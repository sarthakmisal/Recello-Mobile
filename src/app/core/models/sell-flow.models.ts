/* ── Auth ────────────────────────────────────────────────────── */
export interface UserProfile {
  id: string;
  name?: string | null;
  email?: string | null;
  roles?: string[];
  avatar_url?: string | null;
}

export interface AuthResponse {
  accessToken: string;
  user: UserProfile;
}

/* ── Account deletion ───────────────────────────────────────── */
export interface AccountDeleteStatus {
  reason: string;
  remaining_days: number;
}

/* ── Answers / price calc ───────────────────────────────────── */
export interface QuestionAnswer {
  question_id: number;
  options: number[];
}

export interface PriceDeduction {
  label: string;
  amount: number;
}

/** Computed entirely on the client from the variant base price + selected option deductions. */
export interface PriceCalculation {
  basePrice: number;
  finalPrice: number;
  deductions: PriceDeduction[];
}

/* ── Listings (leads) ───────────────────────────────────────── */
export interface ListingCreateRequest {
  category_slug: string;
  brand_slug: string;
  model_slug: string;
  config_id: number;
  answers: QuestionAnswer[];
  expected_price: number;
}

export interface Listing {
  id: string;
  base_price: number;
  quoted_price: number;
  expected_price: number;
  status: string;
}

/* ── Addresses & pickup ─────────────────────────────────────── */
export interface Address {
  id: string;
  user_id?: string;
  name: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  country?: string;
  is_default?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface AddressCreateRequest {
  name: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  country?: string;
  is_default?: boolean;
}

export interface PickupSlot {
  date: string;   // yyyy-mm-dd
  label: string;  // e.g. "Today", "Tomorrow", "Wed, 16 Jul"
  start: string;  // e.g. "10:00"
  end: string;    // e.g. "13:00"
}

export interface PickupRequest {
  listing_id: string;
  address_id: string;
  pickup_date: string;
  pickup_slot_start: string;
  pickup_slot_end: string;
  notes?: string;
}


/* ── Orders ──────────────────────────────────────────────────── */
export interface Order {
  id: string;
  brand?: string;
  model_name?: string;
  variant?: string;
  image_url?: string | null;
  status: string;
  expected_price?: number;
  quoted_price?: number;
  final_price?: number;
  created_at?: string;
  pickup_date?: string;
}
