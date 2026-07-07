import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ApiService } from './api.service';
import { SellQuestion, PriceCalculation, Listing } from '../models/catalog.models';

type MaybeWrapped<T> = T | { data: T };

function unwrap<T>(res: MaybeWrapped<T[]>): T[] {
  return Array.isArray(res) ? res : ((res as { data: T[] }).data ?? []);
}

export interface SellAnswers {
  questionId: string;
  answer: boolean | string | string[];
}

export interface CreateListingPayload {
  categoryId: string;
  brandId: string;
  modelId: string;
  configId: string;
  answers: SellAnswers[];
  address: {
    fullName: string;
    phone: string;
    line1: string;
    city: string;
    state: string;
    pincode: string;
  };
  pickupDate: string;
  pickupSlot: string;
}

@Injectable({ providedIn: 'root' })
export class SellService {
  constructor(private api: ApiService) {}

  getQuestionsForCategory(categoryId: string): Observable<SellQuestion[]> {
    return this.api.get<MaybeWrapped<SellQuestion[]>>(`/sell/questions/${categoryId}`).pipe(
      map(res => unwrap<SellQuestion>(res)),
      catchError(() => of<SellQuestion[]>([]))
    );
  }

  calculatePrice(configId: string, answers: SellAnswers[]): Observable<PriceCalculation> {
    return this.api.post<PriceCalculation>('/sell/calculate', { configId, answers });
  }

  createListing(payload: CreateListingPayload): Observable<Listing> {
    return this.api.post<Listing>('/sell/listings', payload);
  }

  getOrders(): Observable<Listing[]> {
    return this.api.get<MaybeWrapped<Listing[]>>('/sell/orders').pipe(
      map(res => unwrap<Listing>(res)),
      catchError(() => of<Listing[]>([]))
    );
  }

  schedulePickup(listingId: string, date: string, slot: string): Observable<unknown> {
    return this.api.post(`/sell/pickup/${listingId}`, { date, slot });
  }
}
