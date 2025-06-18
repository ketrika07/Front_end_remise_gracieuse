import { NgModule, CUSTOM_ELEMENTS_SCHEMA , LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { GeneralModule } from './modules/general/general.module';
import { ToastrModule } from 'ngx-toastr';
import { ApiInterceptor } from './modules/general/interceptors/api.interceptor';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ModalModule } from 'ngx-bootstrap/modal';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgChartsModule } from 'ng2-charts';

// Import the ListDemandeComponent
import { ListDemandeComponent } from './modules/general/components/list-demande/list-demande.component';
import { DemandeService } from './modules/general/services/demande.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { StatistiqueComponent } from './modules/general/components/statistique/statistique.component';
import { StatistiqueListComponent } from './modules/general/components/statistique-list/statistique-list.component';

registerLocaleData(localeFr);

@NgModule({
  declarations: [
    AppComponent,
    ListDemandeComponent,
    StatistiqueComponent,
    StatistiqueListComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    HttpClientModule,
    FormsModule,
    GeneralModule,
    NgbModule,
    NgChartsModule,
    MatSnackBarModule,
    NgxSpinnerModule,
    ModalModule.forRoot(),
    ToastrModule.forRoot({
      timeOut: 7000,
      closeButton: true,
      enableHtml: true,
      toastClass: 'alert',
      positionClass: 'toast-bottom-right',
    }),
  ],
  providers: [
    DemandeService, // Provide the DemandeService here
    // {
    //   provide: HTTP_INTERCEPTORS,
    //   useClass: ApiInterceptor,
    //   multi: true,
    // },
    { provide: LOCALE_ID, useValue: 'fr-FR' }
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
