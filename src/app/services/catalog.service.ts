import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { map, tap, catchError, shareReplay } from 'rxjs/operators';
import { ApiService } from './api.service';
import { Service, Brand, Series, DeviceModel, ModelConfig, Banner, FAQ } from '../models/catalog.models';

type MaybeWrapped<T> = T | { data: T };

function unwrap<T>(res: MaybeWrapped<T[]>): T[] {
  return Array.isArray(res) ? res : ((res as { data: T[] }).data ?? []);
}

@Injectable({ providedIn: 'root' })
export class CatalogService {
  private _services = new BehaviorSubject<Service[]>([]);
  services$ = this._services.asObservable();

  private servicesCache$?: Observable<Service[]>;

  constructor(private api: ApiService) {}

  getServices(): Observable<Service[]> {
    if (!this.servicesCache$) {
      this.servicesCache$ = this.api.get<MaybeWrapped<Service[]>>('/system/get_services').pipe(
        map(res => unwrap<Service>(res)),
        tap(list => this._services.next(list)),
        catchError(() => of<Service[]>([])),
        shareReplay(1)
      );
    }
    return this.servicesCache$;
  }

  getServiceBySlug(slug: string): Observable<Service> {
    return this.api.get<Service>(`/system/get_services/${slug}`);
  }

  getBrandsForService(serviceId: string): Observable<Brand[]> {
    return this.api.get<MaybeWrapped<Brand[]>>('/system/brands', { categoryId: serviceId }).pipe(
      map(res => unwrap<Brand>(res)),
      catchError(() => of<Brand[]>([]))
    );
  }

  getBrands(): Observable<Brand[]> {
    return this.api.get<MaybeWrapped<Brand[]>>('/system/get_brands').pipe(
      map(res => unwrap<Brand>(res)),
      catchError(() => of<Brand[]>([]))
    );
  }

  getSeriesForBrand(brandId: string): Observable<Series[]> {
    return this.api.get<MaybeWrapped<Series[]>>('/system/series/', { brandId }).pipe(
      map(res => unwrap<Series>(res)),
      catchError(() => of<Series[]>([]))
    );
  }

  getModelsForSeries(seriesId: string): Observable<DeviceModel[]> {
    return this.api.get<MaybeWrapped<DeviceModel[]>>('/catalog/models', { seriesId }).pipe(
      map(res => unwrap<DeviceModel>(res)),
      catchError(() => of<DeviceModel[]>([]))
    );
  }

  getModelsForBrand(brandId: string): Observable<DeviceModel[]> {
    return this.api.get<MaybeWrapped<DeviceModel[]>>('/system/get_models', { brandId }).pipe(
      map(res => unwrap<DeviceModel>(res)),
      catchError(() => of<DeviceModel[]>([]))
    );
  }

  getModelConfigs(modelId: string): Observable<ModelConfig[]> {
    return this.api.get<MaybeWrapped<ModelConfig[]>>('/sell/configs', { modelId }).pipe(
      map(res => unwrap<ModelConfig>(res)),
      catchError(() => of<ModelConfig[]>([]))
    );
  }

  getModel(modelId: string): Observable<DeviceModel> {
    return this.api.get<DeviceModel>(`/catalog/models/${modelId}`);
  }

  getActiveBanners(): Observable<Banner[]> {
    return this.api.get<MaybeWrapped<Banner[]>>('/banners/active').pipe(
      map(res => unwrap<Banner>(res)),
      catchError(() => of<Banner[]>([]))
    );
  }

  getActiveFAQs(): Observable<FAQ[]> {
    return this.api.get<MaybeWrapped<FAQ[]>>('/cms/faqs/active').pipe(
      map(res => unwrap<FAQ>(res)),
      catchError(() => of<FAQ[]>([]))
    );
  }
}
