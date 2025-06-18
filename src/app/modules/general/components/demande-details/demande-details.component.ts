import { Component, HostListener, OnInit, ChangeDetectorRef, ChangeDetectionStrategy , AfterViewInit, NgZone } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DemandeService } from '../../services/demande.service';
import { DetailsDemandeService } from '../../services/details-demande.service';
import { saveAs } from 'file-saver';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EmailService } from '../../services/email.service';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, switchMap, tap, catchError } from 'rxjs/operators';
import { Pipe, PipeTransform } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

interface FileDetails {
  name: string;
  url: string;
  type: string;
}


@Component({
  selector: 'app-demande-details',
  templateUrl: './demande-details.component.html',
  styleUrls: ['./demande-details.component.scss']
})
export class DemandeDetailsComponent implements OnInit, AfterViewInit {
  demandeId: string | null = null;
  demandeDetails: any = {};
  isPopupOpen: boolean = false;
  isLoading: boolean = false;
  isObservationModalOpen: boolean = false;
  newObservation: string = '';
  private loadingSubject = new BehaviorSubject<boolean>(false);
  loading$ = this.loadingSubject.asObservable();

  constructor(
    private route: ActivatedRoute,
    private demandeService: DemandeService,
    private detailsDemandeService: DetailsDemandeService,
    private cdr: ChangeDetectorRef,
    private emailService: EmailService,
    private snackBar: MatSnackBar,
    private ngZone: NgZone,
    private spinner: NgxSpinnerService // Inject NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.pipe(
      tap(params => {
        const id = params.get('idCrgDemande');
        if (id) {
          this.demandeId = id;
          this.refreshFilesSubject.next();
          this.getDemandeDetailsById(id);
        }
      })
    ).subscribe();
  }

  ngAfterViewInit(): void {
    this.cdr.detectChanges();
  }

  ngAfterInit(): void {
  }

  transform(value: any): string {
    if (value === null || value === undefined) return '';
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  }

  getDemandeDetailsById(id: string) {
    this.spinner.show();
    this.demandeService.getDemandeById(id).subscribe({
      next: (demande: any) => {
        this.demandeDetails = demande;
        console.log('Demande details loaded:', this.demandeDetails);
      },
      error: (error) => {
        console.error('Error loading demande details:', error);
        this.snackBar.open('Erreur lors du chargement des détails de la demande', 'Fermer', { duration: 3000 });
      },
      complete: () => {
        this.spinner.hide(); // Hide spinner
      }
    });
  }

  private refreshFilesSubject = new BehaviorSubject<void>(undefined);
  files$ = this.refreshFilesSubject.pipe(
    switchMap(() => {
      if (!this.demandeId) return of([]);
      this.spinner.show(); // Show spinner

      return this.demandeService.getFilesByDemandeId(this.demandeId).pipe(
        map((filePaths: string[]) => {
          if (!filePaths || !Array.isArray(filePaths)) return [];

          return filePaths.map(filePath => {
            const fileName = filePath.split('\\').pop()?.split('/').pop() || '';
            return {
              name: fileName,
              url: `http://localhost:8080/demo/uploads/${encodeURIComponent(fileName)}`,
              type: this.getFileType(fileName.toLowerCase()),
              loadError: false
            };
          });
        }),
        tap(() => {
          this.spinner.hide(); // Hide spinner
          this.cdr.detectChanges();
        }),
        catchError(error => {
          console.error('Error loading files:', error);
          this.spinner.hide(); // Hide spinner
          return of([]);
        })
      );
    })
  );

  @HostListener('input', ['$event'])
  @HostListener('keydown', ['$event'])
  @HostListener('keypress', ['$event'])
  @HostListener('keyup', ['$event'])
  preventInput(event: Event): boolean {
    const target = event.target as HTMLInputElement;
    if (target && target.id !== 'newObservation') {
      event.preventDefault();
      return false;
    }
    return true;
  }

  getFilesByDemandeId(id: string) {
    this.spinner.show(); // Show spinner
    this.demandeService.getFilesByDemandeId(id).subscribe({
      next: (filePaths: string[]) => {
        console.log('Received file paths:', filePaths);
        this.ngZone.run(() => {
          if (filePaths && filePaths.length > 0) {
            this.demandeDetails.files = filePaths.map((filePath: string) => {
              const fileName = filePath.split('\\').pop()?.split('/').pop() || '';
              const fileUrl = `http://localhost:8080/demo/uploads/${encodeURIComponent(fileName)}`;
              return {
                name: fileName,
                url: fileUrl,
                type: this.getFileType(fileName.toLowerCase())
              };
            });
            console.log('Processed files:', this.demandeDetails.files);
            this.cdr.detectChanges();
          }
        });
      },
      error: (error) => {
        console.error('Error loading files:', error);
        this.snackBar.open('Erreur lors du chargement des fichiers', 'Fermer', { duration: 3000 });
      },
      complete: () => {
        this.spinner.hide(); // Hide spinner
      }
    });
  }

  refreshFiles(): void {
    this.refreshFilesSubject.next();
  }

  trackByFileName(index: number, file: any): string {
    return file.name;
  }

  private getFileType(fileName: string): string {
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp'];
    const extension = fileName.split('.').pop()?.toLowerCase() || '';

    if (imageExtensions.includes(extension)) return 'image';
    if (extension === 'pdf') return 'pdf';
    return 'other';
  }

  openPopup(): void {
    this.spinner.show(); // Show spinner
    this.isPopupOpen = true;
    this.spinner.hide(); // Hide spinner
  }

  closePopup(): void {
    this.isPopupOpen = false;
  }

  @HostListener('document:keydown.escape', ['$event'])
  handleEscape(event: KeyboardEvent): void {
    this.closePopup();
  }

  validateDemande(): void {
    // Vérifier si l'ID existe avant de procéder
    if (!this.demandeDetails?.detailsDemande?.idDetCrgDmd) {
      this.snackBar.open('Impossible de valider la demande: ID manquant', 'Fermer', {
        duration: 3000
      });
      return;
    }

    this.spinner.show(); // Show spinner
    this.detailsDemandeService.appliquerSanction(this.demandeDetails.detailsDemande.idDetCrgDmd)
      .subscribe({
        next: (response) => {
          this.ngZone.run(() => {
            if (this.demandeId) {
              this.getDemandeDetailsById(this.demandeId);
            }
            this.snackBar.open('Demande validée avec succès', 'Fermer', {
              duration: 3000
            });
            this.spinner.hide(); // Hide spinner
            this.cdr.detectChanges();
          });
        },
        error: (error) => {
          this.ngZone.run(() => {
            console.error('Erreur:', error);
            this.snackBar.open('Erreur lors de la validation', 'Fermer', {
              duration: 3000
            });
            this.spinner.hide(); // Hide spinner
            this.cdr.detectChanges();
          });
        },
        complete: () => {
          this.spinner.hide(); // Hide spinner
        }
      });
  }

  exportPdf(): void {
    if (this.demandeId) {
      this.spinner.show(); // Show spinner
      this.demandeService.exportPdf(this.demandeId).subscribe({
        next: (response: Blob) => {
          saveAs(response, 'demande.pdf');
          this.spinner.hide(); // Hide spinner on success
        },
        error: (error) => {
          console.error('Error exporting PDF:', error);
          this.snackBar.open('Exportation succeess', 'Fermer', {
            duration: 3000
          });
          this.spinner.hide(); // Hide spinner on error
        },
        complete: () => {
          this.spinner.hide(); // Ensure spinner is hidden on completion
        }
      });
    }
  }

  openObservationModal() {
    document.body.classList.add('modal-open');
    this.isObservationModalOpen = true;
  }

  closeObservationModal() {
    document.body.classList.remove('modal-open');
    this.isObservationModalOpen = false;
  }

  submitObservation(): void {
    // Utiliser detailsDemande.idDetCrgDmd au lieu de demandeDetails.idDetCrgDmd
    if (this.demandeDetails?.detailsDemande?.idDetCrgDmd && this.newObservation?.trim()) {
      this.spinner.show(); // Show spinner

      this.detailsDemandeService.addObservation(
        this.demandeDetails.detailsDemande.idDetCrgDmd,
        this.newObservation.trim()
      ).subscribe({
        next: (response) => {
          console.log('Success:', response);
          this.spinner.hide(); // Hide spinner
          this.snackBar.open('Observation ajoutée avec succès!', 'Fermer', {
            duration: 3000
          });
          this.newObservation = '';
          this.closeObservationModal();
          if (this.demandeId) {
            this.getDemandeDetailsById(this.demandeId);
          }
        },
        error: (error) => {
          console.error('Error:', error);
          this.spinner.hide(); // Hide spinner
          this.snackBar.open('Erreur lors de l\'ajout de l\'observation.', 'Fermer', {
            duration: 3000
          });
        }
      });
    } else {
      console.log('Invalid data:', {
        idDetCrgDmd: this.demandeDetails?.detailsDemande?.idDetCrgDmd,
        observation: this.newObservation
      });
    }
  }

  sendEmail(): void {
    if (this.demandeId) {
      this.spinner.show(); // Show spinner
      this.emailService.sendEmail(this.demandeId).subscribe(
        () => {
          this.spinner.hide(); // Hide spinner
          this.snackBar.open('Email envoyé avec succès!', 'Fermer', {
            duration: 1000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom'
          });
        },
        error => {
          this.spinner.hide(); // Hide spinner
          this.snackBar.open('Erreur lors de l\'envoi de l\'email', 'Fermer', {
            duration: 1000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom'
          });
          console.error('Erreur:', error);
        }
      );
    }
  }

  getEtatLabel(etat: any): string {
    return etat?.nom || 'Inconnu';
  }

  get delayPeriods() {
    return {
      days: this.demandeDetails.detailsDemande?.retardNbJour || 0,
      months: this.demandeDetails.detailsDemande?.retardNbMois || 0,
      years: this.demandeDetails.detailsDemande?.retardNbAn || 0
    };
  }
}
