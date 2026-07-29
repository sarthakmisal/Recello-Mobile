import { Component, OnInit } from '@angular/core';
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
  cancelled: { label: 'Cancelled', cls: 'st-rejected' }
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

  constructor(private sell: SellService, protected authService: AuthService) { }

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    this.loadError = false;
    this.sell.getOrders().subscribe({
      next: (res: any) => { this.orders = res || []; this.loading = false; },
      error: () => { this.loading = false; this.loadError = true; }
    });
  }

  price(o: Order): number {
    return o.final_price ?? o.quoted_price ?? o.expected_price ?? 0;
  }

  status(o: Order): { label: string; cls: string } {
    return STATUS_MAP[o.status] || { label: o.status, cls: 'st-pending' };
  }

  title(o: Order): string {
    return [o.brand, o.model_name].filter(Boolean).join(' ') || 'Device';
  }

  myRedirect(path: string) {
    window.location.href = path
  }
}
