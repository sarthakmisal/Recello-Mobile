import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { map, catchError, tap, shareReplay } from 'rxjs/operators';
import { ApiService } from './api.service';
import {
  ApiCategory, ApiBrand, ApiSeries, ApiModel, ApiModelDetail, ApiQuestionResponse,
  Category, Brand, Series, DeviceModel, ModelDetail, SellQuestion
} from '../models/catalog.models';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CatalogService {
  private categoriesCache$: Observable<Category[]> | null = null;
  private _categories = new BehaviorSubject<Category[]>([]);
  readonly categories$ = this._categories.asObservable();

  constructor(private api: ApiService) {}

  /* ApiService already prepends environment.apiUrl — just provide the path */

  /* ── Categories (/api/system/get_categories/true) ─ */
  getCategories(): Observable<Category[]> {
    if (!this.categoriesCache$) {
      this.categoriesCache$ = this.api.get<ApiCategory[]>('/api/system/get_categories/true').pipe(
        map(res => (Array.isArray(res) ? res : [])
          .filter(c => c.status)
          .map(c => ({ id: c.id, name: c.name, slug: c.slug, url: c.url, status: c.status }))),
        tap(list => this._categories.next(list)),
        catchError(() => of<Category[]>([])),
        shareReplay(1)
      );
    }
    return this.categoriesCache$;
  }

  /* ── Brands (/api/system/get_brands/:catSlug) ────── */
  getBrandsByCategory(catSlug: string): Observable<Brand[]> {
    return this.api.get<ApiBrand[]>(`/api/system/get_brands/${catSlug}`).pipe(
      map(res => (Array.isArray(res) ? res : [])
        .filter(b => b.status)
        .map(b => ({
          id: b.id, name: b.name, slug: b.slug, url: b.url,
          seriesCount: parseInt(b.series_count ?? '0', 10)
        }))),
      catchError(() => of<Brand[]>([]))
    );
  }

  /* ── Series (/api/product/brand/:brandSlug/series) ─ */
  getSeriesByBrand(brandSlug: string): Observable<Series[]> {
    return this.api.get<ApiSeries[]>(`/api/product/brand/${brandSlug}/series`).pipe(
      map(res => (Array.isArray(res) ? res : []).map(s => ({ name: s.name, slug: s.slug }))),
      catchError(() => of<Series[]>([]))
    );
  }

  /* ── Models (/api/product/brand/:brandSlug[/:seriesSlug]/models) */
  getModelsByBrand(brandSlug: string, seriesSlug?: string): Observable<DeviceModel[]> {
    const path = seriesSlug
      ? `/api/product/brand/${brandSlug}/${seriesSlug}/models`
      : `/api/product/brand/${brandSlug}/models`;
    return this.api.get<ApiModel[]>(path).pipe(
      map(res => (Array.isArray(res) ? res : []).map(m => ({ name: m.name, slug: m.slug, url: m.url }))),
      catchError(() => of<DeviceModel[]>([]))
    );
  }

  /* ── Model detail + variants (/api/product/:brandSlug/:modelSlug) */
  getModelDetail(brandSlug: string, modelSlug: string): Observable<ModelDetail | null> {
    return this.api.get<ApiModelDetail[]>(`/api/product/${brandSlug}/${modelSlug}`).pipe(
      map(res => {
        const arr = Array.isArray(res) ? res : [];
        if (!arr.length) return null;
        const first = arr[0];
        return {
          name: first.name, slug: first.slug, url: first.url,
          variants: (first.variants ?? []).map(v => ({
            id: v.id, name: v.name, basePrice: parseFloat(v.base_price) || 0
          }))
        };
      }),
      catchError(() => of<ModelDetail | null>(null))
    );
  }

  /* ── Questions (/sell/questions/:modelSlug) ─────── */
  getQuestions(modelSlug: string): Observable<SellQuestion[]> {
    return this.api.get<ApiQuestionResponse[]>(`/sell/questions/${modelSlug}`).pipe(
      map(res => {
        const arr = Array.isArray(res) ? res : [];
        if (!arr.length || !arr[0].questions) return [];
        return arr[0].questions.map(q => ({
          id: q.id, question: q.question, queType: q.que_type,
          contextLabel: q.context_label,
          options: (q.options ?? []).map(o => ({ id: o.id, text: o.text, deduction: o.deduction }))
        }));
      }),
      catchError(() => of<SellQuestion[]>([]))
    );
  }

  imgUrl(url: string): string {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    return `${environment.imgBase}${url}`;
  }
}
