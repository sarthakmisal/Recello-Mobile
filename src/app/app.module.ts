import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
import { AuthService } from './core/services/auth.service';
import { FaqPage } from './features/content/faq.page';
import { ContactUsPage } from './features/content/contact-us.page';
import { TermsConditionsPage } from './features/content/terms-conditions.page';

export function restoreAuth(auth: AuthService): () => Promise<void> {
  return () => auth.restore();
}

@NgModule({
  declarations: [AppComponent, FaqPage, ContactUsPage, TermsConditionsPage],
  imports: [BrowserModule, IonicModule.forRoot(), HttpClientModule, CoreModule, SharedModule, AppRoutingModule],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: APP_INITIALIZER, useFactory: restoreAuth, deps: [AuthService], multi: true }
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
