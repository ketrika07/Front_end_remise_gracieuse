import { Component, OnInit } from '@angular/core';
import { DemandeService } from '../../services/demande.service';
import { saveAs } from 'file-saver';
import { NgxSpinnerService } from 'ngx-spinner';

export interface Demande {
  idCrgDemande: string;
  periode: string;
  dateCreation: Date;
  etatNom: string;
  telephone: string;
  email: string;
}

@Component({
  selector: 'app-client-list',
  templateUrl: './client-list.component.html',
  styleUrls: ['./client-list.component.scss']
})
export class ClientListComponent implements OnInit {
  demandes: Demande[] = [];
  matricule: string = '900310';
  showPreviewModal = false;
  selectedDemandeId: string = '';

  constructor(private demandeService: DemandeService, private spinner: NgxSpinnerService) {}

  ngOnInit(): void {
    this.getDemandesByMatricule(this.matricule);
  }

  getDemandesByMatricule(matricule: string): void {
    this.spinner.show();
    this.demandeService.getDemandesByMatricule(matricule).subscribe(
      (data: any[]) => {
        this.demandes = data;
        this.spinner.hide();
      },
      (error) => {
        console.error('Error fetching demandes', error);
        this.spinner.hide()
      }
    );
  }


  getFieldsetStatus(demande: Demande): string {
    switch (demande.etatNom) {
      case 'Approuve':
        return 'status-approved';
      case 'Rejete':
        return 'status-rejected';
      case 'En attente':
        return 'status-pending';
      default:
        return '';
    }
  }

  openPreview(demande: Demande): void {
    this.spinner.show();
    this.selectedDemandeId = demande.idCrgDemande;
    this.showPreviewModal = true;
    this.spinner.hide();
  }

  closePreview(): void {
    this.spinner.show();
    this.showPreviewModal = false;
    this.selectedDemandeId = '';
    this.spinner.hide();
  }

  exportPdf(): void {
    if (this.selectedDemandeId) {
      this.spinner.show();
      this.demandeService.exportPdf(this.selectedDemandeId).subscribe((response: Blob) => {
        saveAs(response, 'demande.pdf');
        this.spinner.hide();
      }, (error) => {
        console.error('Error exporting pdf', error);
        this.spinner.hide();
      });
    }
  }


}
