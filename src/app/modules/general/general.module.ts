import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxSpinnerModule } from 'ngx-spinner';
import { GeneralRoutingModule } from './general-routing.module';
import { GeneralComponent } from './general.component';
import { DocumentationComponent } from './pages/documentation/documentation.component';
import { PageVideComponent } from './pages/page-vide/page-vide.component';
import { FooterComponent } from './components/footer/footer.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { DemandeDetailsComponent } from './components/demande-details/demande-details.component';
import { EmailComponent } from './components/email/email.component';
import { DemandeUpdateComponent } from './components/demande-update/demande-update.component';
import { FormsModule } from '@angular/forms';
import { ClientListComponent } from './components/client-list/client-list.component';
import { InsertDemandeComponent } from './components/insert-demande/insert-demande.component';
import { SafeUrlPipe } from '../general/safe-url.pipe';
import { NgChartsModule } from 'ng2-charts';
import { NumberFormatPipe } from '../general/number-format.pipe';
import { NumberSeparatorPipe } from '../general/NumberSeparatorPipe';

@NgModule({
  declarations: [
    GeneralComponent,
    DocumentationComponent,
    PageVideComponent,
    FooterComponent,
    NavbarComponent,
    SidebarComponent,
    DemandeDetailsComponent,
    EmailComponent,
    DemandeUpdateComponent,
    ClientListComponent,
    InsertDemandeComponent,
    NumberFormatPipe,
    NumberSeparatorPipe,
    SafeUrlPipe
  ],
  imports: [CommonModule, GeneralRoutingModule,FormsModule, NgxSpinnerModule],
  exports: [FooterComponent, NavbarComponent, SidebarComponent,EmailComponent],
})
export class GeneralModule {}
