import { Component, HostListener, Input, OnInit } from '@angular/core';
import { DemandeService } from '../../services/demande.service';
import { DetailsDemande } from '../../model/DetailsDemande';

interface DemandeResponse {
  dateLimite: string;
  employeurNom: string;
  observation: string;
  mrDue: number;
  pourcentageSanction: number;
  employeurMatricule: string;
  nouveauMrDue: number;
  periode: string;
  numeroReferenceDossier: string;
}

@Component({
  selector: 'app-email',
  templateUrl: './email.component.html',
  styleUrls: ['./email.component.scss']
})
export class EmailComponent implements OnInit {
  @Input() idCrgDemande!: string;
  showPopup: boolean = false;
  detailsDemande: DemandeResponse[] = [];
  demandeInfo: DetailsDemande[] = [];
  currentDate = new Date().toISOString().split('T')[0];
  error: string = '';
  numeroReferenceDossier: string = '';

  constructor(private demandeService: DemandeService) { }

  ngOnInit(): void {
    if (this.idCrgDemande) {
      this.loadDemandeDetails();
    }
  }

  loadDemandeDetails(): void {
    this.demandeService.getDetailsByIdCrgDemande(this.idCrgDemande)
      .subscribe({
        next: (data: DemandeResponse[]) => {
          this.detailsDemande = data;
          if (data.length > 0) {
            this.numeroReferenceDossier = data[0].numeroReferenceDossier;
          }
          this.showPopup = true;
        },
        error: (err) => {
          console.error('Erreur lors du chargement des détails:', err);
          this.error = 'Erreur lors du chargement des détails de la demande';
        }
      });
  }

  openPopup(): void {
    this.loadDemandeDetails();
  }

  closePopup(): void {
    this.showPopup = false;
    this.error = '';
  }

  @HostListener('document:keydown.escape', ['$event'])
  handleEscape(event: KeyboardEvent): void {
    this.closePopup();
  }

  onOverlayClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('email-overlay')) {
      this.closePopup();
    }
  }

  formatDate(date: string): string {
    if (!date) return '';
    // Ajout d'une vérification pour la date
    return new Date(date).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).split('/').join('-');
  }

  formatNumber(value: number): string {
    return value.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  getPourcentageReduction(mrDue: number, nouveauMrDue: number): number {
    return ((mrDue - nouveauMrDue) / mrDue) * 100;
  }

  getFormattedPeriode(periode: string): string {
    if (periode.length === 6) {
      return `${periode.slice(0, 4)}-${periode.slice(4)}`;
    }
    return periode;
  }
}
