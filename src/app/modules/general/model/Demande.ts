import { DetailsDemande } from './DetailsDemande';
import { Etat } from './Etat';

export class Demande {
  idCrgDemande: string | null;
  matricule?: string;
  idEtat: number;
  dateCreation: Date;
  telephone?: string;
  email?: string;
  detailsDemandeList?: DetailsDemande[];
  etat?: Etat;
  filePaths: string[];
  numeroReferenceDossier: string;

  constructor(
    idCrgDemande: string | null = null,
    matricule?: string,
    telephone?: string,
    email?: string,
    raisonSociale?: string,
    idEtat: number = 1,
    dateCreation: Date = new Date(),
    detailsDemandeList?: DetailsDemande[],
    etat?: Etat,
    numeroReferenceDossier: string | null = null
  ) {
    this.idCrgDemande = idCrgDemande;
    this.matricule = matricule;
    this.telephone = telephone;
    this.email = email;
    this.idEtat = idEtat;
    this.dateCreation = dateCreation;
    this.detailsDemandeList = detailsDemandeList;
    this.etat = etat;
    this.filePaths = []; // Initialize the filePaths array
    this.numeroReferenceDossier = numeroReferenceDossier ?? '/DIGC/CIE/' + new Date().toISOString().slice(0, 10).replace(/-/g, '') + '/0001';
  }
}
