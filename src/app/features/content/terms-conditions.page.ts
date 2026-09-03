import { Component } from '@angular/core';
import { Location } from '@angular/common';

@Component({
    selector: 'rc-terms-conditions-page',
    templateUrl: './terms-conditions.page.html',
    styleUrls: ['./terms-conditions.page.scss'],
    standalone: false
})
export class TermsConditionsPage {
    sections = [
        { title: '1. Acceptance of Terms', body: 'By using Recello services, you agree to these Terms & Conditions, as updated from time to time.' },
        { title: '2. Device Selling Terms', body: 'You confirm that the device you sell is legally yours and is accurately described during the evaluation process.' },
        { title: '3. Payment and Settlement', body: 'We may adjust the final offer after physical verification, if the actual condition differs from the declared condition.' },
        { title: '4. Pickup and Logistics', body: 'Recello may arrange collection from your location in Pune or a nearby supported service area. You provide reasonable access for the pickup.' },
        { title: '5. Privacy and Data', body: 'Any personal or device data you share with us will be handled in line with our Privacy Policy and relevant laws.' },
        { title: '6. Limitation of Liability', body: 'Recello is not liable for incidental or consequential damages arising out of use of the platform or the services provided.' }
    ];

    constructor(private location: Location) { }

    goBack(): void {
        this.location.back();
    }
}
