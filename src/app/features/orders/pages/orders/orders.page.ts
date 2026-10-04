import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { SellService } from '../../../../core/services/sell.service';
import { Order } from '../../../../core/models/sell-flow.models';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/core/services/auth.service';

const STATUS_MAP: Record<string, { label: string; cls: string }> = {
  pending: { label: 'Pending', cls: 'st-pending' },
  scheduled: { label: 'Pickup scheduled', cls: 'st-scheduled' },
  pickup_scheduled: { label: 'Pickup scheduled', cls: 'st-scheduled' },
  picked_up: { label: 'Picked up', cls: 'st-progress' },
  in_progress: { label: 'In progress', cls: 'st-progress' },
  completed: { label: 'Completed', cls: 'st-done' },
  paid: { label: 'Paid', cls: 'st-done' },
  rejected: { label: 'Rejected', cls: 'st-rejected' },
  cancelled: { label: 'Cancelled', cls: 'st-rejected' },
  new: { label: 'New', cls: 'st-pending' }
};

@Component({
  selector: 'rc-orders',
  templateUrl: './orders.page.html',
  styleUrls: ['./orders.page.scss'],
  standalone: false
})
export class OrdersPage implements OnInit {
  loading = true;
  loadError = false;
  orders: Order[] = [];
  protected basePath = `${environment.apiUrl}/uploads/`;

  constructor(
    private sell: SellService,
    protected authService: AuthService,
    private router: Router,
    private location: Location
  ) { }

  goBack(): void { this.location.back(); }

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    this.loadError = false;
    this.sell.getOrders().subscribe({
      next: (res: any) => { this.orders = Array.isArray(res) ? res : []; this.loading = false; },
      error: () => { this.loading = false; this.loadError = true; }
    });
  }

  price(o: Order): number {
    return Number(o.final_price ?? o.quoted_price ?? o.expected_price ?? o.base_price ?? 0);
  }

  status(o: Order): { label: string; cls: string } {
    const key = String(o.status ?? '').trim().toLowerCase().replace(/\s+/g, '_');
    return STATUS_MAP[key] || { label: key || 'Pending', cls: 'st-pending' };
  }

  title(o: Order): string {
    return [o.brand, o.model_name ?? o.model].filter(Boolean).join(' ') || 'Device';
  }

  subtitle(o: Order): string {
    const bits = [o.variant, o.pickup_date ? `Pickup ${new Date(o.pickup_date).toLocaleDateString('en-IN')}` : null]
      .filter(Boolean);
    return bits.join(' • ') || 'Sell request';
  }

  createdOn(o: Order): string {
    return o.created_at ? new Date(o.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Recently';
  }

  myRedirect(path: string): void {
    this.router.navigateByUrl(path);
  }
}
