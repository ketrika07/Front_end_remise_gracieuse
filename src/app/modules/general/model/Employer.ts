export class Employeur {
  matricule: string;
  raisonSociale: string;
  tel: string;
  mail: string;
  employeurDateAdhesion: Date;
  dernierDeclaration: string;
  dernierPaiement: string;
  adresse: string;
  region: string;
  nomRegion: string;
  fivAdmin: string;
  nomFivAdmin: string;
  firAdmin: string;
  nomFirAdmin: string;
  fkt: string;
  nomFkt: string;
  emplois1erEmbauche: Date;
  codeActivite: string;
  activite: string;
  secteur: string;
  codeDrAdmin: string;
  drAdmin: string;
  nbTravs: number;
  etat: string;
  classe: string;
  codeDrAntenneAdmin: string;
  libelleDrAntenneAdmin: string;
  typeDrAdmin: string;
  zoneAdmin: string;
  cgAnaAdmin: string;
  codeTrsDrsAdmin: string;
  fiv: string;
  nomFiv: string;
  fir: string;
  nomFir: string;
  codeDr: string;
  dr: string;
  codeDrAntenne: string;
  libelleDrAntenne: string;
  typeDr: string;
  zone: string;
  cgAna: string;
  codeTrsDrs: string;
  gestionnaire: string;

  constructor(
    matricule: string,
    raisonSociale: string,
    tel: string,
    mail: string,
    employeurDateAdhesion: Date,
    dernierDeclaration: string,
    dernierPaiement: string,
    adresse: string,
    region: string,
    nomRegion: string,
    fivAdmin: string,
    nomFivAdmin: string,
    firAdmin: string,
    nomFirAdmin: string,
    fkt: string,
    nomFkt: string,
    emplois1erEmbauche: Date,
    codeActivite: string,
    activite: string,
    secteur: string,
    codeDrAdmin: string,
    drAdmin: string,
    nbTravs: number,
    etat: string,
    classe: string,
    codeDrAntenneAdmin: string,
    libelleDrAntenneAdmin: string,
    typeDrAdmin: string,
    zoneAdmin: string,
    cgAnaAdmin: string,
    codeTrsDrsAdmin: string,
    fiv: string,
    nomFiv: string,
    fir: string,
    nomFir: string,
    codeDr: string,
    dr: string,
    codeDrAntenne: string,
    libelleDrAntenne: string,
    typeDr: string,
    zone: string,
    cgAna: string,
    codeTrsDrs: string,
    gestionnaire: string
  ) {
    this.matricule = matricule;
    this.raisonSociale = raisonSociale;
    this.tel = tel;
    this.mail = mail;
    this.employeurDateAdhesion = employeurDateAdhesion;
    this.dernierDeclaration = dernierDeclaration;
    this.dernierPaiement = dernierPaiement;
    this.adresse = adresse;
    this.region = region;
    this.nomRegion = nomRegion;
    this.fivAdmin = fivAdmin;
    this.nomFivAdmin = nomFivAdmin;
    this.firAdmin = firAdmin;
    this.nomFirAdmin = nomFirAdmin;
    this.fkt = fkt;
    this.nomFkt = nomFkt;
    this.emplois1erEmbauche = emplois1erEmbauche;
    this.codeActivite = codeActivite;
    this.activite = activite;
    this.secteur = secteur;
    this.codeDrAdmin = codeDrAdmin;
    this.drAdmin = drAdmin;
    this.nbTravs = nbTravs;
    this.etat = etat;
    this.classe = classe;
    this.codeDrAntenneAdmin = codeDrAntenneAdmin;
    this.libelleDrAntenneAdmin = libelleDrAntenneAdmin;
    this.typeDrAdmin = typeDrAdmin;
    this.zoneAdmin = zoneAdmin;
    this.cgAnaAdmin = cgAnaAdmin;
    this.codeTrsDrsAdmin = codeTrsDrsAdmin;
    this.fiv = fiv;
    this.nomFiv = nomFiv;
    this.fir = fir;
    this.nomFir = nomFir;
    this.codeDr = codeDr;
    this.dr = dr;
    this.codeDrAntenne = codeDrAntenne;
    this.libelleDrAntenne = libelleDrAntenne;
    this.typeDr = typeDr;
    this.zone = zone;
    this.cgAna = cgAna;
    this.codeTrsDrs = codeTrsDrs;
    this.gestionnaire = gestionnaire;
  }
}
