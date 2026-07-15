import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  ApiBrand, ApiModel, ApiModelDetail, ApiSeries, Brand, DeviceModel, ModelDetail, Series
} from '../models/catalog.models';

@Injectable({ providedIn: 'root' })
export class CatalogService {
  private product = `${environment.apiUrl}/product`;
  private system = `${environment.apiUrl}/system`;

  constructor(private http: HttpClient) { }

  /** GET /api/system/get_brands — public brand list (also used by admin). */
  getBrands(): Observable<Brand[]> {
    return this.http.get<ApiBrand[]>(`${this.system}/get_brands`).pipe(
      map((list) => list.filter((b) => b.status).map((b) => ({
        id: b.id, name: b.name, slug: b.slug, url: b.url,
        seriesCount: Number(b.series_count ?? 0)
      })))
    );
  }

  /** GET /api/product/brand/:brandSlug/series — optional, only if a brand has series. */
  getSeries(brandSlug: string): Observable<Series[]> {
    return this.http.get<ApiSeries[]>(`${this.product}/brand/${brandSlug}/series`);
  }

  /** GET /api/product/brand/:brandSlug/models (or scoped to a series). */
  getModels(brandSlug: string, seriesSlug?: string): Observable<DeviceModel[]> {
    const url = seriesSlug
      ? `${this.product}/brand/${brandSlug}/${seriesSlug}/models`
      : `${this.product}/brand/${brandSlug}/models`;
    return this.http.get<ApiModel[]>(url);
  }

  /** GET /api/product/:brandSlug/:modelSlug — variants + base prices for a model. */
  getModelDetail(brandSlug: string, modelSlug: string): Observable<ModelDetail> {
    return this.http.get<any>(`${this.product}/${brandSlug}/${modelSlug}`).pipe(
      map((d) => {
        console.log('raw model detail response:', d);
        // Support two shapes: { ... , variants: [...] } or [ { ... , variants: [...] } ]
        const src = Array.isArray(d) ? d[0] ?? {} : d ?? {};
        return {
          name: src.name, slug: src.slug, url: src.url,
          variants: (src.variants || []).map((v: any) => ({
            id: String(v.id), name: v.name, base_price: Number(v.base_price)
          }))
        } as ModelDetail;
      })
    );
  }
}
