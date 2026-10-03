import { Component } from '@angular/core';
import { Location } from '@angular/common';

interface Founder {
  initials: string;
  name: string;
  role: string;
  note: string;
}

@Component({
  selector: 'rc-about-us',
  templateUrl: './about-us.page.html',
  styleUrls: ['./about-us.page.scss'],
  standalone: false
})
export class AboutUsPage {
  readonly founders: Founder[] = [
    { initials: 'KT', name: 'Kabier Ranveersingh Thakur', role: 'Co-Founder', note: 'Building a transparent resale experience' },
    { initials: 'SA', name: 'Santosh Pandit Aiwale', role: 'Co-Founder', note: 'Focused on dependable customer service' },
    { initials: 'MR', name: 'Mohan Shankar Rathod', role: 'Co-Founder', note: 'Driving smarter reuse and refurbishment' }
  ];

  constructor(private location: Location) { }

  goBack(): void {
    this.location.back();
  }
}
