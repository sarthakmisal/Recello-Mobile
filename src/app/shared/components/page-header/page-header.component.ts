import { Component, Input } from '@angular/core';
import { Location } from '@angular/common';

/**
 * One shared header for every secondary page (Profile, Orders, About Us, Quick Sell, etc.)
 * Uses Ionic's own <ion-button>/<ion-icon>, which are built on Ionic's gesture controller and
 * register a tap reliably on the first try. A plain hand-rolled <button> (what every page used
 * to have, each slightly differently) is exactly the kind of element that can need a second
 * tap in a Capacitor/Ionic WebView — this fixes that by construction, everywhere, at once.
 */
@Component({
  selector: 'rc-page-header',
  templateUrl: './page-header.component.html',
  styleUrls: ['./page-header.component.scss'],
  standalone: false
})
export class PageHeaderComponent {
  /** Title shown in the header. */
  @Input() title = '';

  constructor(private location: Location) { }

  goBack(): void {
    this.location.back();
  }
}
