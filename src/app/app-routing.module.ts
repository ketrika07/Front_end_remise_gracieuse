import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppGuard } from './modules/general/guard/app.guard';
import { ListDemandeComponent } from './modules/general/components/list-demande/list-demande.component';
import { DemandeDetailsComponent } from './modules/general/components/demande-details/demande-details.component';
import { ClientListComponent } from './modules/general/components/client-list/client-list.component';
import { InsertDemandeComponent } from './modules/general/components/insert-demande/insert-demande.component';
import { StatistiqueListComponent } from './modules/general/components/statistique-list/statistique-list.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'general',
    pathMatch: 'full',
  },
  {
    path: 'general',
    loadChildren: () =>
      import('./modules/general/general.module').then((m) => m.GeneralModule),
  },
  { path: 'general/list-demande', component: ListDemandeComponent },
  { path: 'demande-details/:id', component: DemandeDetailsComponent },
  { path: 'general/client-list', component: ClientListComponent },
  { path: 'general/statistique-list', component: StatistiqueListComponent },
  { path: 'general/insert-demande', component: InsertDemandeComponent},
  {
    path: '**',
    redirectTo: 'general',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
