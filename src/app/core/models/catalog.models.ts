/* ── Raw API shapes (as returned by Express) ────────────────── */
export interface ApiBrand {
  id: string;
  name: string;
  slug: string;
  url: string;
  status: boolean;
  series_count?: string;
}

export interface ApiSeries {
  name: string;
  slug: string;
}

export interface ApiModel {
  name: string;
  slug: string;
  url: string;
}

export interface ApiVariant {
  id: string;
  name: string;
  base_price: string;
}

export interface ApiModelDetail {
  name: string;
  slug: string;
  url: string;
  variants: ApiVariant[];
}

export interface ApiOption {
  id: number;
  text: string;
  deduction: number;
  show: number[];
  option_image_id?: string | null;
  option_image_url?: string | null;
}

export interface ApiQuestion {
  id: number;
  text: string;
  input_type: 'single_select' | 'multi_select';
  description: string;
  context_label: string;
  sort_index: number;
  options: ApiOption[];
  categories: { id: number; name: string }[];
}

export interface ApiQuestionResponse {
  model: string;
  questions: ApiQuestion[];
}

/* ── App-facing models ──────────────────────────────────────── */
export interface Brand {
  id: string;
  name: string;
  slug: string;
  url: string;
  seriesCount: number;
}

export interface Series {
  name: string;
  slug: string;
}

export interface DeviceModel {
  name: string;
  slug: string;
  url: string;
}

export interface Variant {
  id: string;
  name: string;
  base_price: number;
}

export interface ModelDetail {
  name: string;
  slug: string;
  url: string;
  variants: Variant[];
}

export type QuestionType = 'single_select' | 'multi_select';

export interface SellOption {
  id: number;
  text: string;
  deduction: number;
  show: number[];
  option_image_url?: string | null;
}

export interface SellQuestion {
  id: number;
  question: string;
  que_type: QuestionType;
  description?: string;
  context_label: string;
  sort_index: number;
  options: SellOption[];
}
