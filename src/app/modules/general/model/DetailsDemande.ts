export class DetailsDemande {
  idDetCrgDmd: string;
  idCrgDemande?: string;
  periode: string;
  motif: string;
  idNotification: number;
  observation: string;
  idTauxCrg?: number | null;
  sessionDate: Date;
  nouveauMrDue: number;
  numeroNotification: number;
  datePaiement?: Date | null;
  dateLimite?: Date;
  retardNbJour?: number;
  retardNbMois?: number;
  retardNbAn?: number;

  constructor(
    idDetCrgDmd: string,
    idCrgDemande: string,
    periode: string,
    motif: string,
    idNotification: number,
    observation: string,
    idTauxCrg: number,
    sessionDate: Date,
    nouveauMrDue: number,
    numeroNotification: number,
    datePaiement: Date | null,
    dateLimite: Date,
    retardNbJour?: number,
    retardNbMois?: number,
    retardNbAn?: number
  ) {
    this.idDetCrgDmd = idDetCrgDmd;
    this.idCrgDemande = idCrgDemande;
    this.periode = periode;
    this.motif = motif;
    this.idNotification = idNotification;
    this.observation = observation;
    this.idTauxCrg = idTauxCrg;
    this.sessionDate = sessionDate;
    this.nouveauMrDue = nouveauMrDue;
    this.numeroNotification = numeroNotification;
    this.datePaiement = datePaiement;
    this.dateLimite = dateLimite;
    this.retardNbJour = retardNbJour;
    this.retardNbMois = retardNbMois;
    this.retardNbAn = retardNbAn;
  }
}
