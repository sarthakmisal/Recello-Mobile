import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { AppStateService } from '../../services/app-state.service';

@Component({
    selector: 'app-content',
    standalone: true,
    imports: [CommonModule, FormsModule, IonicModule],
    templateUrl: './content.page.html',
    styleUrls: ['./content.page.scss'],
})
export class ContentPage implements OnInit {
    slug = '';

    constructor(private route: ActivatedRoute, readonly state: AppStateService) { }

    ngOnInit(): void {
        this.route.params.subscribe((params) => {
            this.slug = params['slug'] ?? '';
        });
    }

    get page() {
        return this.state.staticPages[this.slug];
    }
}
