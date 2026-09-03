import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Location } from '@angular/common';

interface FaqItem {
    question: string;
    answer: string;
}

@Component({
    selector: 'rc-faq-page',
    templateUrl: './faq.page.html',
    styleUrls: ['./faq.page.scss'],
    standalone: false
})
export class FaqPage implements OnInit {
    items: FaqItem[] = [];
    loading = true;

    constructor(private http: HttpClient, private location: Location) { }

    ngOnInit(): void {
        this.http.get<FaqItem[]>(`${environment.apiUrl}/api/faqs/active`).subscribe({
            next: (data) => {
                this.items = Array.isArray(data) && data.length ? data : this.defaultFaqs;
                this.loading = false;
            },
            error: () => {
                this.items = this.defaultFaqs;
                this.loading = false;
            }
        });
    }

    goBack(): void {
        this.location.back();
    }

    private readonly defaultFaqs: FaqItem[] = [
        {
            question: 'How is my phone price calculated?',
            answer: 'The quote is based on model, storage, age, physical condition, screen, functionality, warranty and current resale demand.'
        },
        {
            question: 'Is doorstep pickup free?',
            answer: 'Yes. Recello pickup and inspection are free in our supported Pune locations.'
        },
        {
            question: 'When will I receive payment?',
            answer: 'Once the pickup expert verifies the phone and you accept the final offer, payment is released right away.'
        },
        {
            question: 'Do I need to log in to sell my phone?',
            answer: 'Yes, to protect your sessions and keep a secure record of your transaction, we require a quick login before you confirm the final pickup.'
        }
    ];
}
