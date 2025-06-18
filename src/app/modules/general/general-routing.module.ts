import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GeneralComponent } from './general.component';
import { DocumentationComponent } from './pages/documentation/documentation.component';
import { PageVideComponent } from './pages/page-vide/page-vide.component';
import { ListDemandeComponent } from './components/list-demande/list-demande.component'; // Assurez-vous que le chemin est correct
import { DemandeDetailsComponent} from './components/demande-details/demande-details.component';
import { DemandeUpdateComponent} from './components/demande-update/demande-update.component';
import { ClientListComponent } from './components/client-list/client-list.component';
import { InsertDemandeComponent } from './components/insert-demande/insert-demande.component';
import { StatistiqueComponent } from './components/statistique/statistique.component';
import { StatistiqueListComponent } from './components/statistique-list/statistique-list.component';

const routes: Routes = [
  {
    path: '',
    component: GeneralComponent,
    children: [
      {
        path: '',
        redirectTo: 'documentation',
        pathMatch: 'full',
      },
      {
        path: 'documentation', // child route path
        component: DocumentationComponent, // child route component that the router renders
      },
      {
        path: 'page-vide', // child route path
        component: PageVideComponent, // child route component that the router renders
      },
      {
        path: 'list-demande', // child route path
        component: ListDemandeComponent, // child route component that the router renders
      },
      { path: 'demande-details/:idCrgDemande',
        component: DemandeDetailsComponent
      },
      {
        path: 'demande-update/:idDetCrgDmd',
         component: DemandeUpdateComponent
      },
      {
        path: 'client-list',
        component: ClientListComponent
      },
      {
        path: 'insert-demande',
        component: InsertDemandeComponent
      },
      {
        path: 'statistique',
        component: StatistiqueComponent
      },
      {
        path: 'statistique-list',
        component: StatistiqueListComponent
      },
      { path: '**', redirectTo: 'documentation' },
    ],
  },
  { path: '**', redirectTo: 'documentation' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GeneralRoutingModule {}
