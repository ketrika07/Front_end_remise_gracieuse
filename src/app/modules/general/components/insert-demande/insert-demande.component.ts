import { Component, OnInit } from '@angular/core';
import { NgForm, Validators } from '@angular/forms';
import { DemandeService } from '../../services/demande.service';
import { Demande } from '../../model/Demande';
import { DetailsDemande } from '../../model/DetailsDemande';
import * as $ from 'jquery';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

interface Motif {
  value: string;
  description: string;
}

@Component({
  selector: 'app-insert-demande',
  templateUrl: './insert-demande.component.html',
  styleUrls: ['./insert-demande.component.scss']
})

export class InsertDemandeComponent implements OnInit {
  formData = {
    email: '',
    phone: '',
    matriculation: '',
    raisonSociale: '',
    periods: [{ trimestre: '', annee: '' }],
    selectedMotif: '',
    selectedMotifDisplay: '',
    otherMotif: '',
    fileUpload: null as File | null
  };

  formModal = {
    showFileInput: false,
    showOtherMotifInput: false
  };

  availableYears: number[] = [];
  demandes: any[] = [];
  isLoading = false;
  isSubmitting = false;
  validationErrors: { [key: number]: string } = {};
  motifs: Motif[] = [
    { value: 'motif_1', description: 'Difficulté financière' },
    { value: 'motif_2', description: 'Simple demande' },
    { value: 'motif_3', description: 'Nouvelle demande après règlement' },
    { value: 'erreurBanque', description: 'Erreur de la banque' },
    { value: 'motif_5', description: 'Versement échelonné' },
    { value: 'autreMotif', description: 'Autre motif' }
  ];

  constructor(private demandeService: DemandeService, private spinner: NgxSpinnerService, private router: Router, private snackBar: MatSnackBar) {}

  ngOnInit() {
    const currentYear = new Date().getFullYear();
    this.availableYears = [];
    for (let year = currentYear; year >= 1900 ; year--) {
      this.availableYears.push(year);
    }

    $(document).ready(function() {
      $('.custom-file-input').on('change', function(event) {
        const inputFile = event.currentTarget as HTMLInputElement;
        if (inputFile.files && inputFile.files[0]) {
          $(inputFile).parent()
            .find('.custom-file-label')
            .html(inputFile.files[0].name);
        }
      });
    });

    this.loadDemandes();
  }

  loadDemandes(): void {
    this.spinner.show();
    this.isLoading = true;
    this.demandeService.getDemandesByMatricule(this.formData.matriculation).subscribe(
      (data: any[]) => {
        console.log('Demandes chargées:', data);
        this.demandes = data;
        this.spinner.hide();
        this.isLoading = false;
      },
      (error) => {
        console.error('Erreur lors de la récupération des demandes', error);
        this.spinner.hide();
        this.isLoading = false;
      }
    );
  }


  canAddNewPeriod(): boolean {
    const lastPeriod = this.formData.periods[this.formData.periods.length - 1];
    return lastPeriod.trimestre !== '' && lastPeriod.annee !== '';
  }

  addNewPeriodInput() {
    if (this.canAddNewPeriod()) {
      this.formData.periods.push({ trimestre: '', annee: '' });
    }
  }

  onMatriculationChange(): void {
    if (this.formData.matriculation && this.formData.matriculation.length > 0) {
      this.spinner.show();
      this.demandeService.findNumeroMatricule(this.formData.matriculation).subscribe({
        next: (response: string) => {
          if (response && response.trim().length > 0) {
            this.formData.raisonSociale = response;
            this.loadDemandes();
          } else {
            this.formData.raisonSociale = '';
            this.snackBar.open('Aucun employeur trouvé pour ce matricule', 'Fermer', {
              duration: 3000,
              panelClass: ['warning-snackbar']
            });
          }
          this.spinner.hide();
        },
        error: (error) => {
          console.error('Erreur lors de la recherche de l\'employeur:', error);
          this.formData.raisonSociale = '';
          this.snackBar.open('Erreur lors de la recherche de l\'employeur', 'Fermer', {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
          this.spinner.hide();
        }
      });
    } else {
      this.formData.raisonSociale = '';
    }
  }

  onSubmit(form: NgForm) {
    this.validationErrors = {};
    let isValid = true;

    this.formData.periods.forEach((period, index) => {
      if (this.isPeriodUsed(period.trimestre, period.annee, index)) {
        this.validationErrors[index] = 'Cette période et ce trimestre ont déjà été sélectionnés.';
        isValid = false;
      }
    });

    if (!isValid) {
      this.snackBar.open('Veuillez corriger les erreurs de période', 'Fermer', {
        duration: 3000,
        panelClass: ['snackbar-error']
      });
      return;
    }

    if (form.valid) {
      this.isSubmitting = true;
      this.spinner.show();

      const detailsDemandeList: Array<DetailsDemande> = this.formData.periods
        .map(period => new DetailsDemande(
          '',
          '',
          `${period.annee}${period.trimestre.toString().padStart(2, '0')}`,
          this.formData.selectedMotifDisplay,
          1,
          'Aucune observation',
          0,
          new Date(),
          0,
          1,
          null,
          new Date(),
          0,
          0,
          0
        ))
        .filter(details => details.periode);

      if (detailsDemandeList.length === 0) {
        this.spinner.hide();
        this.isSubmitting = false;
        this.snackBar.open('Veuillez ajouter au moins une période', 'Fermer', {
          duration: 3000,
          panelClass: ['snackbar-error']
        });
        return;
      }

      const demande: Demande = new Demande(
        null,
        this.formData.matriculation,
        this.formData.phone,
        this.formData.email,
        this.formData.raisonSociale,
        1,
        new Date(),
        detailsDemandeList
      );

      this.demandeService.createDemandeWithDetails(demande).subscribe({
        next: (response) => {
          if (this.formData.fileUpload) {
            const uploadData = new FormData();
            uploadData.append('file', this.formData.fileUpload);

            this.demandeService.uploadFileForDemande(uploadData, response.idCrgDemande as string).subscribe({
              next: (uploadResponse) => {
                this.handleSuccess('Demande créée avec succès et fichier téléchargé');
              },
              error: (uploadError) => {
                this.handleError('Erreur lors du téléchargement du fichier');
              }
            });
          } else {
            this.handleSuccess('Demande créée avec succès');
          }
        },
        error: (error) => {
          let errorMessage = 'Erreur lors de la création de la demande';

          if (error.error && typeof error.error === 'string') {
            if (error.error.includes("La période et le MrDue existent déjà")) {
              errorMessage = "Cette période existe déjà pour cet employeur";
            } else if (error.error.includes("L'ID de la demande doit être nul")) {
              errorMessage = "Erreur système : ID de demande invalide";
            } else if (error.error.includes("La liste des détails")) {
              errorMessage = "La liste des périodes ne peut pas être vide";
            } else if (error.error.includes("Il n'y a pas de MrDue")) {
              errorMessage = "Il n'y a pas de MrDue dans cette période, la demande ne peut pas etre valider";
            } else if (error.error.includes("Cotisation principale impayée")) {
              errorMessage = "Cotisation principale impayée pour cette periode";
            } else if (error.error.includes("Failed to retrieve")) {
              errorMessage = "Erreur lors de la génération de l'identifiant";
            }
          }

          this.handleError(errorMessage);
        }
      });
    } else {
      this.snackBar.open('Veuillez remplir tous les champs obligatoires', 'Fermer', {
        duration: 3000,
        panelClass: ['snackbar-error']
      });
    }
  }

  private handleSuccess(message: string) {
    this.spinner.hide();
    this.isSubmitting = false;
    this.snackBar.open(message, 'Fermer', {
      duration: 3000,
      panelClass: ['snackbar-success']
    });
    this.loadDemandes();
    setTimeout(() => {
      this.router.navigate(['general/client-list']);
    }, 2000);
  }

  private handleError(message: string) {
    this.spinner.hide();
    this.isSubmitting = false;
    this.snackBar.open(message, 'Fermer', {
      duration: 5000,
      panelClass: ['snackbar-error']
    });
  }

  onFileSelected(event: any): void {
    const file = event.target.files?.[0];
    if (file) {
      this.formData.fileUpload = file;
      // Le nom du fichier s'affichera automatiquement grâce au binding
      console.log('Fichier sélectionné:', file.name);
    }
  }

  toggleInputs() {
    const selectedMotif = this.motifs.find(m => m.value === this.formData.selectedMotif);
    if (selectedMotif) {
      if (selectedMotif.value === 'autreMotif') {
        this.formModal.showOtherMotifInput = true;
      } else {
        this.formModal.showOtherMotifInput = false;
        this.formData.selectedMotifDisplay = selectedMotif.description;
      }
      this.formModal.showFileInput = selectedMotif.value === 'erreurBanque'  || selectedMotif.value === 'motif_5';
    }
  }

  onOtherMotifChange() {
    if (this.formData.otherMotif) {
      this.formData.selectedMotifDisplay = this.formData.otherMotif;
    }
  }

  viewDetails(idCrgDemande: string): void {
    if (idCrgDemande) {
      this.spinner.show();
      this.isLoading = true;
      this.router.navigate(['/general/demande-details', idCrgDemande]).then(() => {
        setTimeout(() => {
          this.spinner.hide();
          this.isLoading = false;
        }, 3000);
      });
    } else {
      console.error('Invalid idCrgDemande:', idCrgDemande);
    }
  }

  // Method to check if a period is already selected
  isPeriodUsed(trimestre: string, annee: string, currentIndex: number): boolean {
    return this.formData.periods.some((period, index) => period.trimestre === trimestre && period.annee === annee && index !== currentIndex);
  }
}
