export interface Service {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  isActive: boolean;
}

export interface Brand {
  _id: string;
  name: string;
  slug: string;
  image?: string;
}

export interface Series {
  _id: string;
  name: string;
  slug: string;
  brandId: string;
}

export interface DeviceModel {
  _id: string;
  name: string;
  slug: string;
  image?: string;
  brandId: string;
  seriesId?: string;
}

export interface ModelConfig {
  _id: string;
  name: string;
  storage?: string;
  color?: string;
  ram?: string;
  modelId: string;
  basePrice: number;
}

export interface SellQuestion {
  _id: string;
  text: string;
  key: string;
  type: 'boolean' | 'single' | 'multi';
  options?: QuestionOption[];
  order: number;
}

export interface QuestionOption {
  _id: string;
  text: string;
  deductionType: 'flat' | 'percent';
  deductionValue: number;
}

export interface PriceCalculation {
  basePrice: number;
  finalPrice: number;
  deductions: { label: string; amount: number }[];
}

export interface Listing {
  _id: string;
  deviceName: string;
  serviceSlug: string;
  brandName: string;
  modelName: string;
  configName: string;
  offer: number;
  status: string;
  createdAt: string;
  pickupDate?: string;
  pickupSlot?: string;
}

export interface Address {
  fullName: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
}

export interface UserProfile {
  _id: string;
  name: string;
  phone: string;
  email?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface Banner {
  _id: string;
  title: string;
  subtitle?: string;
  image?: string;
  ctaText?: string;
  ctaLink?: string;
}

export interface FAQ {
  _id: string;
  question: string;
  answer: string;
  category?: string;
}
