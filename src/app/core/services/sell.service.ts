import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiQuestionResponse, SellOption, SellQuestion } from '../models/catalog.models';
import {
  Address, AddressCreateRequest, Listing, ListingCreateRequest,
  PickupRequest, PriceCalculation, QuestionAnswer
} from '../models/sell-flow.models';

@Injectable({ providedIn: 'root' })
export class SellService {
  private sell = `${environment.apiUrl}/api/sell`;
  private users = `${environment.apiUrl}/api/users`;

  constructor(private http: HttpClient) {}

  /** GET /sell/questions/:modelSlug — returns an array with one entry per model. */
  getQuestionsByModel(modelSlug: string): Observable<SellQuestion[]> {
    return this.http.get<ApiQuestionResponse>(`${this.sell}/questions/${modelSlug}`).pipe(
      map((res) => {
        const entry = Array.isArray(res) ? res[0] : undefined;
        return (entry?.questions ?? []).map((q) => ({
          id: q.id,
          question: q.question,
          que_type: q.que_type,
          context: q.context,
          context_label: q.context_label,
          options: (q.options || []).map((o) => ({
            id: o.id,
            text: o.text,
            deduction: o.deduction,
            show: o.show || [],
            option_image_id: o.option_image_id ?? null,
            option_image_url: o.option_image_url ?? null
          }))
        }));
      })
    );
  }

  /**
   * The backend doesn't expose a calculate-price endpoint — the deduction % on
   * each selected option is applied to the variant's base price locally, and
   * the resulting figure is sent as `expected_price` when the listing is created.
   */
  computePrice(basePrice: number, questions: SellQuestion[], answers: QuestionAnswer[]): PriceCalculation {
    const questionById = new Map(questions.map((q) => [q.id, q]));
    const deductions: { label: string; amount: number }[] = [];
    let totalDeductionAmount = 0;

    for (const ans of answers) {
      const question = questionById.get(ans.question_id);
      if (!question) continue;
      const selected = question.options.filter((o: SellOption) => ans.options.includes(o.id));
      for (const opt of selected) {
        if (!opt.deduction) continue;
        const amount = Math.round((basePrice * opt.deduction) / 100);
        totalDeductionAmount += amount;
        deductions.push({ label: opt.text, amount });
      }
    }

    const finalPrice = Math.max(basePrice - totalDeductionAmount, 0);
    return { basePrice, finalPrice, deductions };
  }

  /** POST /api/sell/listings (requires auth) */
  createListing(payload: ListingCreateRequest): Observable<Listing> {
    return this.http.post<Listing>(`${this.sell}/listings`, payload);
  }

  /** POST /api/sell/pickup (requires auth) */
  schedulePickup(payload: PickupRequest): Observable<unknown> {
    return this.http.post(`${this.sell}/pickup`, payload);
  }

  /** GET /api/users/addresses/ (requires auth) */
  getAddresses(): Observable<Address[]> {
    return this.http.get<Address[]>(`${this.users}/addresses/`);
  }

  /** POST /api/users/addresses/ (requires auth) */
  addAddress(address: AddressCreateRequest): Observable<Address> {
    return this.http.post<Address>(`${this.users}/addresses/`, address);
  }
}
