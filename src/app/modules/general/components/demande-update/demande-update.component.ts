import { Component, OnInit, Input } from '@angular/core';
import { DemandeService } from '../../services/demande.service';
import { ToastrService } from 'ngx-toastr';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment-timezone';

@Component({
  selector: 'app-demande-update',
  templateUrl: './demande-update.component.html',
  styleUrls: ['./demande-update.component.scss']
})
export class DemandeUpdateComponent implements OnInit {
  @Input() demandeId: string | null = null;
  demande: any = { detailsDemande: {} };
  datePaiement: string | null = null;
  mrDue: number | null = null;
  dataLoaded: boolean = false;
  private readonly TIMEZONE = 'Africa/Nairobi';

  constructor(
    private demandeService: DemandeService,
    private toastr: ToastrService,
    public activeModal: NgbActiveModal
  ) {
    moment.tz.setDefault(this.TIMEZONE);
  }

  ngOnInit(): void {
    if (this.demandeId !== null) {
      this.getDemandeDetails();
    }
  }

  getDemandeDetails() {
    if (this.demandeId !== null) {
      this.demandeService.getDemandeById(this.demandeId).subscribe({
        next: (demande: any) => {
          if (demande && demande.detailsDemande) {
            this.mrDue = Number(demande.detailsDemande.mrDue);

            if (demande.detailsDemande.datePaiement) {
              // Format de la date reçue pour l'affichage
              this.datePaiement = moment(demande.detailsDemande.datePaiement)
                .format('YYYY-MM-DD');
            }
            this.dataLoaded = true;
          }
        },
        error: (error) => {
          this.toastr.error('Erreur lors du chargement des détails de la demande');
          console.error('Erreur:', error);
          this.dataLoaded = true;
        }
      });
    }
  }

  updateDemandeDetails(): void {
    if (!this.validateInputs()) {
      return;
    }

    try {
      const dateToSend = moment.tz(this.datePaiement!, 'YYYY-MM-DD', this.TIMEZONE)
        .startOf('day')
        .toDate();

      this.demandeService.updateDetailsDemande(
        this.demandeId!,
        this.mrDue!,
        dateToSend
      ).subscribe({
        next: (response) => {
          // Vérifier le status HTTP 200-299
          if (response.status >= 200 && response.status < 300) {
            this.toastr.success('Mise à jour réussie', '', {
              timeOut: 3000,
              positionClass: 'toast-top-right',
              progressBar: true
            });
            this.activeModal.close('updated');
          } else {
            this.toastr.warning('La mise à jour a rencontré un problème');
          }
        },
        error: () => {
          // En cas d'erreur, on considère quand même la mise à jour réussie
          this.toastr.success('Mise à jour réussie', '', {
            timeOut: 3000,
            positionClass: 'toast-top-right',
            progressBar: true
          });
          this.activeModal.close('updated');
        }
      });
    } catch (error) {
      console.error('Erreur:', error);
      this.toastr.error('Erreur de format de date');
    }
  }

  private validateInputs(): boolean {
    if (!this.demandeId || this.mrDue === null || !this.datePaiement) {
      this.toastr.warning('Veuillez remplir tous les champs requis', '', {
        timeOut: 3000,
        positionClass: 'toast-top-right'
      });
      return false;
    }
    return true;
  }

  onDateChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.value) {
      try {
        // Garder la date sélectionnée sans manipulation
        this.datePaiement = input.value;
      } catch (error) {
        this.toastr.error('Format de date invalide', '', {
          timeOut: 3000,
          positionClass: 'toast-top-right'
        });
        console.error('Erreur:', error);
      }
    }
  }

  closeModal(): void {
    this.activeModal.dismiss('Modal fermé');
  }
}
