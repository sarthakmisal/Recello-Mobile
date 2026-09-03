import { Component } from '@angular/core';
import { Location } from '@angular/common';

@Component({
    selector: 'rc-contact-us-page',
    templateUrl: './contact-us.page.html',
    styleUrls: ['./contact-us.page.scss'],
    standalone: false
})
export class ContactUsPage {
    constructor(private location: Location) { }

    goBack(): void {
        this.location.back();
    }
}
