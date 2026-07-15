/* ── Auth ────────────────────────────────────────────────────── */
export interface UserProfile {
  _id?: string;
  id?: string;
  name?: string;
  phone?: string;
  email?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user?: UserProfile;
  isNewUser?: boolean;
}

/* ── Answers / price calc ───────────────────────────────────── */
export interface QuestionAnswer {
  question_id: number;
  option_ids: number[];
}

export interface CalculatePriceRequest {
  model_slug: string;
  variant_id: string;
  answers: QuestionAnswer[];
}

export interface PriceDeduction {
  label: string;
  amount: number;
}

export interface PriceCalculation {
  basePrice: number;
  finalPrice: number;
  deductions: PriceDeduction[];
}

/* ── Listings (leads) ───────────────────────────────────────── */
export interface ListingCreateRequest {
  model_slug: string;
  variant_id: string;
  brand: string;
  model: string;
  variant: string;
  base_price: number;
  final_price: number;
  answers: QuestionAnswer[];
}

export interface Listing {
  _id: string;
  deviceName: string;
  offer: number;
  status: string;
  createdAt: string;
  pickupDate?: string;
  pickupSlot?: string;
}

/* ── Addresses & pickup ─────────────────────────────────────── */
export interface Address {
  id: string;
  label?: string;
  line1: string;
  line2?: string;
  city: string;
  pincode: string;
  phone?: string;
  isDefault?: boolean;
}

export interface PickupSlot {
  date: string;   // yyyy-mm-dd
  label: string;  // e.g. "Today", "Tomorrow", "Wed, 16 Jul"
}

export interface PickupRequest {
  listing_id: string;
  address_id?: string;
  address?: Partial<Address>;
  pickup_date: string;
  pickup_slot: string;
}
