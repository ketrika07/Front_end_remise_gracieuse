import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

declare interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
  category?: string;
  badge?: {
    text: string;
    variant: string;
  };
}

export const ROUTES: RouteInfo[] = [
  {
    path: '/general/documentation',
    title: 'Documentation',
    icon: 'education_agenda-bookmark',
    class: '',
    category: 'DOCUMENTATION'
  },
  {
    path: '/general/client-list',
    title: 'Liste des demandes',
    icon: 'users_single-02',
    class: '',
    category: 'GESTION DEMANDES',
    badge: {
      text: 'New',
      variant: 'success'
    }
  },
  {
    path: '/general/list-demande',
    title: 'Traitement demandes',
    icon: 'business_chart-bar-32',
    class: '',
    category: 'GESTION DEMANDES'
  },
  {
    path: '/general/insert-demande',
    title: 'Insertion demande',
    icon: 'ui-1_simple-add',
    class: '',
    category: 'GESTION DEMANDES'
  },
  {
    path: '/general/statistique',
    title: 'Tableau de bord',
    icon: 'design_app',
    class: '',
    category: 'STATISTIQUES'
  },
  {
    path: '/general/statistique-list',
    title: 'Rapports détaillés',
    icon: 'files_paper',
    class: '',
    category: 'STATISTIQUES'
  }
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent implements OnInit {
  menuItems: any[] = [];
  menuItemsByCategory: { [key: string]: RouteInfo[] } = {};
  config: any;

  constructor(private httpClient: HttpClient, private router: Router) {}

  ngOnInit() {
    // Configuration headers
    const headers = new HttpHeaders()
      .set('Cache-Control', 'no-cache')
      .set('Pragma', 'no-cache');

    // Charger la configuration
    this.httpClient
      .get<any>('/assets/config.json', { headers })
      .subscribe((config) => {
        this.config = config;
      });

    // Grouper les items par catégorie
    this.menuItemsByCategory = ROUTES.reduce((acc, item) => {
      const category = item.category || 'AUTRES';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(item);
      return acc;
    }, {} as { [key: string]: RouteInfo[] });

    this.menuItems = ROUTES.filter((menuItem) => menuItem);
  }

  // Obtenir les catégories
  getCategories(): string[] {
    return Object.keys(this.menuItemsByCategory);
  }

  // Obtenir les items d'une catégorie
  getItemsByCategory(category: string): RouteInfo[] {
    return this.menuItemsByCategory[category] || [];
  }

  // Vérifier si un item est actif
  isActive(path: string): boolean {
    return this.router.isActive(path, true);
  }

  navigateToClientList() {
    this.router.navigate(['/general/client-list']);
  }

  navigateToTraitement() {
    this.router.navigate(['/general/list-demande']);
  }
}
