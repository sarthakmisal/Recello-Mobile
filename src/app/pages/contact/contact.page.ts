import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
    selector: 'app-contact',
    standalone: true,
    imports: [CommonModule, FormsModule, IonicModule],
    templateUrl: './contact.page.html',
    styleUrls: ['./contact.page.scss'],
})
export class ContactPage {
    form = { name: '', email: '', subject: '', message: '' };
    saved = false;

    submit(): void {
        const items = JSON.parse(localStorage.getItem('recello-contact') ?? '[]');
        items.unshift(this.form);
        localStorage.setItem('recello-contact', JSON.stringify(items));
        this.saved = true;
    }
}
