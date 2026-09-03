import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    {
        path: 'faq',
        loadComponent: () => import('./faq.page').then((m) => m.FaqPage)
    },
    {
        path: 'contact-us',
        loadComponent: () => import('./contact-us.page').then((m) => m.ContactUsPage)
    },
    {
        path: 'terms-conditions',
        loadComponent: () => import('./terms-conditions.page').then((m) => m.TermsConditionsPage)
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ContentRoutingModule { }
