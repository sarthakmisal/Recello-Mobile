import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiQuestionResponse, SellQuestion } from '../models/catalog.models';
import {
  Address, CalculatePriceRequest, Listing, ListingCreateRequest,
  PickupRequest, PriceCalculation
} from '../models/sell-flow.models';

@Injectable({ providedIn: 'root' })
export class SellService {
  private sell = `${environment.apiUrl}/sell`;
  // NOTE: address endpoints were not in the provided routes; adjust the base
  // below in one place if your backend exposes them elsewhere (e.g. /api/users).
  private users = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) {}

  /** GET /api/sell/questions/:modelSlug */
  getQuestionsByModel(modelSlug: string): Observable<SellQuestion[]> {
    return this.http.get<ApiQuestionResponse>(`${this.sell}/questions/${modelSlug}`).pipe(
      map((res) => (res.questions || []).map((q) => ({
        id: q.id,
        question: q.text,
        que_type: q.input_type,
        description: q.description,
        context_label: q.context_label,
        sort_index: q.sort_index,
        options: (q.options || []).map((o) => ({
          id: o.id, text: o.text, deduction: o.deduction,
          show: o.show || [], option_image_url: o.option_image_url ?? null
        }))
      })).sort((a, b) => a.sort_index - b.sort_index))
    );
  }

  /** POST /api/sell/calculate-price */
  calculatePrice(payload: CalculatePriceRequest): Observable<PriceCalculation> {
    return this.http.post<PriceCalculation>(`${this.sell}/calculate-price`, payload);
  }

  /** POST /api/sell/listings (requires auth) */
  createListing(payload: ListingCreateRequest): Observable<Listing> {
    return this.http.post<Listing>(`${this.sell}/listings`, payload);
  }

  /** POST /api/sell/pickup (requires auth) */
  schedulePickup(payload: PickupRequest): Observable<Listing> {
    return this.http.post<Listing>(`${this.sell}/pickup`, payload);
  }

  /** Assumed endpoint — swap if your backend differs. */
  getAddresses(): Observable<Address[]> {
    return this.http.get<Address[]>(`${this.users}/addresses`);
  }

  /** Assumed endpoint — swap if your backend differs. */
  addAddress(address: Partial<Address>): Observable<Address> {
    return this.http.post<Address>(`${this.users}/addresses`, address);
  }
}
