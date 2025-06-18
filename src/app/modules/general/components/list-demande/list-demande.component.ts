import { Component, OnInit } from '@angular/core';
import { DemandeService } from '../../services/demande.service';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { filter } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DemandeUpdateComponent } from '../demande-update/demande-update.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-list-demande',
  templateUrl: './list-demande.component.html',
  styleUrls: ['./list-demande.component.scss']
})
export class ListDemandeComponent implements OnInit {
  demandes: any[] = [];
  filteredDemandes: any[] = [];
  searchCriteria: any = {
    matricule: '',
    dateDebut: '',
    dateFin: '',
    periode: ''
  };
  isLoading: boolean = false;
  private searchTimeout: any;

  constructor(
    private demandeService: DemandeService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private modalService: NgbModal,
    private toastr: ToastrService
  ) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationStart)
    ).subscribe(() => {
      this.spinner.show();
      this.isLoading = true;
    });

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd || event instanceof NavigationCancel || event instanceof NavigationError)
    ).subscribe(() => {
      setTimeout(() => {
        this.spinner.hide();
        this.isLoading = false;
      }, 3000);
    });
  }

  ngOnInit(): void {
    this.loadDemandes();
  }

  loadDemandes(): void {
    this.spinner.show();
    this.isLoading = true;
    this.demandeService.getDemandesRecentsDetails().subscribe(
      data => {
        console.log('Données reçues de getDemandesRecentsDetails:', data);
        if (data && Array.isArray(data)) {
          this.demandes = data.map(item => {
            if (!item.employeurNom) {
              item.employeurNom = {};
            }
            return item;
          });
          this.filteredDemandes = [...this.demandes];
          setTimeout(() => {
            this.spinner.hide();
            this.isLoading = false;
            this.toastr.success('Les données ont été chargées avec succès');
          }, 3000);
        } else {
          this.demandes = [];
          this.filteredDemandes = [];
          setTimeout(() => {
            this.spinner.hide();
            this.isLoading = false;
            this.toastr.info('Aucune donnée disponible');
          }, 3000);
        }
      },
      error => {
        console.error('Erreur lors du chargement des données :', error);
        this.demandes = [];
        this.filteredDemandes = [];
        setTimeout(() => {
          this.spinner.hide();
          this.isLoading = false;
          this.toastr.error('Erreur lors du chargement des données');
        }, 3000);
      }
    );
  }

  onSearch(): void {
    const { matricule, dateDebut, dateFin, periode } = this.searchCriteria;
    this.spinner.show();
    this.isLoading = true;

    this.demandeService.searchDemandes(matricule, periode, dateDebut, dateFin).subscribe(
      data => {
        if (data && Array.isArray(data)) {
          this.filteredDemandes = data.map(item => {
            const demande = item.demande;
            demande.etatNom = item.etatNom;
            demande.periode = item.periode;
            demande.employeurNom = demande.employeur.employeurNom; // Assurez-vous d'extraire employeurNom
            return demande;
          });
          setTimeout(() => {
            this.spinner.hide();
            this.isLoading = false;
            this.toastr.success('Recherche effectuée avec succès');
          }, 3000);
        } else {
          this.filteredDemandes = [];
          setTimeout(() => {
            this.spinner.hide();
            this.isLoading = false;
            this.toastr.info('Aucun résultat trouvé');
          }, 3000);
        }
      },
      error => {
        console.error('Erreur lors de la récupération des résultats de recherche :', error);
        setTimeout(() => {
          this.spinner.hide();
          this.isLoading = false;
          this.toastr.error('Erreur lors de la recherche');
        }, 3000);
      }
    );
  }

  exportToExcel(): void {
    this.spinner.show();
    this.isLoading = true;
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.filteredDemandes);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, 'demandes');
    setTimeout(() => {
      this.spinner.hide();
      this.isLoading = false;
    }, 3000);
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    saveAs(data, `${fileName}_export_${new Date().getTime()}.xlsx`);
  }

  viewDetails(demandeId: string): void {
    this.spinner.show();
    this.isLoading = true;
    this.router.navigate(['/general/demande-details', demandeId]).then(() => {
      setTimeout(() => {
        this.spinner.hide();
        this.isLoading = false;
      }, 3000);
    });
  }

  navigateToUpdate(demandeId: string): void {
    if (demandeId != null) {
      const modalRef = this.modalService.open(DemandeUpdateComponent, {
        size: 'lg',
        backdrop: 'static'
      });
      modalRef.componentInstance.demandeId = demandeId;

      modalRef.result.then(
        (result) => {
          if (result === 'updated') {
            // Recharger la liste des demandes après la mise à jour
            this.loadDemandes();
          }
        },
        (reason) => {
          // Gérer la fermeture du modal si nécessaire
        }
      );
    } else {
      console.error('demandeId invalide:', demandeId);
    }
  }
  // Ajouter cette méthode dans la classe
  onAutomaticSearch(): void {
    // Debounce la recherche pour éviter trop d'appels API
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }

    this.searchTimeout = setTimeout(() => {
      this.onSearch();
    }, 500);
  }

  // Add this method to your component class
  getStatusClass(status: string): string {
    const statusMap: { [key: string]: string } = {
      'En attente': 'status-en-attente',
      'Approuve': 'status-approuve',
      'Rejete': 'status-rejete'
    };
    return statusMap[status] || '';
  }

  getIconClass(etatNom: string): string {
    switch (etatNom) {
      case 'Approuve':
        return 'fas fa-check-circle text-success';
      case 'Rejete':
        return 'fas fa-times-circle text-danger';
      case 'En attente':
        return 'fas fa-hourglass-half text-warning';
      default:
        return '';
    }
  }



}
