import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

// Interface for the response type
export interface TauxEmployeur {
  taux: number;
  nombreEmployeurs: number;
}

export interface Demande {
  idCrgDemande: number;
  matricule: string;
  idEtat: number;
  dateCreation: string;
  etatNom: string;
  periode: string;
  motif: string;
  mrDue: number;
  idNotification: number;
  observation: string;
  idTauxCrg: number;
  sessionDate: string;
  nouveauMrDue: number;
  numeroNotification: number;
  datePaiement: string;
  dateLimite: string;
  retardNbJour: number;
  retardNbMois: number;
  retardNbAn: number;
}

@Injectable({
  providedIn: 'root'
})
export class TauxCrgService {
  private apiUrl = 'http://localhost:8080/demo/api/tauxCrg'; // Base URL to your Spring Boot backend

  constructor(private http: HttpClient) { }

  getNombreEmployeursParTaux(): Observable<TauxEmployeur[]> {
    return this.http.get<TauxEmployeur[]>(`${this.apiUrl}/nombreEmployeursParTaux`)
      .pipe(
        catchError(error => {
          console.error('Error fetching taux CRG data:', error);
          throw error;
        })
      );
  }

  getDemandesWithinDateRange(): Observable<Demande[]> {
    return this.http.get<Demande[]>(`${this.apiUrl}/demandesWithinDateRange`)
      .pipe(
        catchError(error => {
          console.error('Error fetching demandes data:', error);
          throw error;
        })
      );
  }
}
