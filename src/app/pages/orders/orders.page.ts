import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Subscription, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { SellService } from '../../services/sell.service';
import { AuthService } from '../../services/auth.service';
import { Listing } from '../../models/catalog.models';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.page.html',
  styleUrls: ['./orders.page.scss'],
  standalone: false,
})
export class OrdersPage implements OnInit, OnDestroy {
  orders: Listing[] = [];
  loading = true;
  private subs = new Subscription();

  readonly statusConfig: Record<string, { color: string; bg: string }> = {
    pending:         { color: '#FFB547', bg: 'rgba(255,181,71,0.12)' },
    assigned:        { color: '#4F7EFF', bg: 'rgba(79,126,255,0.10)' },
    'pickup-scheduled': { color: '#4F7EFF', bg: 'rgba(79,126,255,0.10)' },
    'in-progress':   { color: '#8b5cf6', bg: 'rgba(139,92,246,0.10)' },
    completed:       { color: '#22c55e', bg: 'rgba(34,197,94,0.10)' },
    cancelled:       { color: '#ef4444', bg: 'rgba(239,68,68,0.10)' },
  };

  constructor(
    private router: Router,
    private navCtrl: NavController,
    private sellService: SellService,
    public auth: AuthService,
  ) {}

  ngOnInit(): void {
    if (!this.auth.isLoggedIn) {
      this.router.navigate(['/login'], { queryParams: { returnUrl: '/orders' } });
      return;
    }
    this.loadOrders();
  }

  loadOrders(): void {
    this.loading = true;
    this.subs.add(
      this.sellService.getOrders().pipe(catchError(() => of([]))).subscribe(orders => {
        this.orders = orders as Listing[];
        this.loading = false;
      })
    );
  }

  get stats() {
    return [
      { val: String(this.orders.length), label: 'Total', icon: 'receipt-outline', color: '#4F7EFF' },
      {
        val: this.orders.filter(o => o.status === 'completed').length
          ? '₹' + this.orders.filter(o => o.status === 'completed').reduce((a, b) => a + b.offer, 0).toLocaleString('en-IN')
          : '₹0',
        label: 'Earned',
        icon: 'cash-outline',
        color: '#00D2B8',
      },
      {
        val: String(this.orders.filter(o => !['completed', 'cancelled'].includes(o.status)).length),
        label: 'Active',
        icon: 'time-outline',
        color: '#FFB547',
      },
    ];
  }

  getStatusStyle(status: string) {
    return this.statusConfig[status?.toLowerCase()] ?? { color: '#8993a4', bg: 'rgba(137,147,164,0.10)' };
  }

  getStatusLabel(status: string): string {
    const map: Record<string, string> = {
      pending: 'Pending',
      assigned: 'Assigned',
      'pickup-scheduled': 'Pickup Scheduled',
      'in-progress': 'In Progress',
      completed: 'Completed',
      cancelled: 'Cancelled',
    };
    return map[status?.toLowerCase()] ?? status;
  }

  back(): void { this.navCtrl.back(); }
  sellAnother(): void { this.router.navigate(['/']); }
  ngOnDestroy(): void { this.subs.unsubscribe(); }
}
