import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';

interface Order {
    id: string;
    device: string;
    condition: string;
    date: string;
    price: number;
    status: string;
    statusColor: string;
}

@Component({
    selector: 'app-orders',
    templateUrl: './orders.page.html',
    styleUrls: ['./orders.page.scss'],
    standalone: false,
})
export class OrdersPage {
    stats = [
        { val: '3', label: 'Total Orders', icon: 'receipt-outline', color: '#4F7EFF' },
        { val: '₹96K', label: 'Total Earned', icon: 'cash-outline', color: '#00D2B8' },
        { val: '1', label: 'Pending', icon: 'time-outline', color: '#FFB547' },
    ];

    orders: Order[] = [
        {
            id: '#RCL-001',
            device: 'Apple iPhone 14 Pro',
            condition: 'Excellent',
            date: '12 Jun 2025',
            price: 52000,
            status: 'Completed',
            statusColor: '#00D2B8',
        },
        {
            id: '#RCL-002',
            device: 'Samsung Galaxy S23',
            condition: 'Good',
            date: '28 Jun 2025',
            price: 29000,
            status: 'Processing',
            statusColor: '#FFB547',
        },
        {
            id: '#RCL-003',
            device: 'MacBook Air M2',
            condition: 'Good',
            date: '2 Jul 2025',
            price: 62000,
            status: 'Pickup Scheduled',
            statusColor: '#4F7EFF',
        },
    ];

    constructor(private router: Router, private navCtrl: NavController) { }

    back() {
        this.navCtrl.back();
    }

    sellAnother() {
        this.router.navigate(['/']);
    }
}
