import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Demande } from '../model/Demande';
import * as moment from 'moment';
import { formatDate } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class DemandeService {
  private baseUrl = 'http://localhost:8080/demo/api/demandes';

  constructor(private http: HttpClient) { }

  getDemandesRecentsDetails(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/recents`);
  }

  searchDemandes(matricule?: string, periode?: string, dateDebut?: string, dateFin?: string): Observable<any[]> {
    let params = new HttpParams();
    if (matricule) {
      params = params.set('matricule', matricule);
    }
    if (periode) {
      params = params.set('periode', periode);
    }
    if (dateDebut) {
      params = params.set('dateDebut', dateDebut);
    }
    if (dateFin) {
      params = params.set('dateFin', dateFin);
    }
    return this.http.get<any[]>(`${this.baseUrl}/search`, { params });
  }

  // getDemandeDetailsById(idCrgDemande: string): Observable<Demande[]> {
  //   return this.http.get<Demande[]>(`${this.baseUrl}/${idCrgDemande}/details`);
  // }

  updateDetailsDemande(idCrgDemande: string, mrDue: number, datePaiement: Date): Observable<any> {
    const params = new HttpParams()
      .set('mrDue', mrDue.toString())
      .set('datePaiement', moment(datePaiement).format('YYYY-MM-DD'));

    return this.http.put<any>(`${this.baseUrl}/update/${idCrgDemande}`, null, {
      params,
      observe: 'response'
    });
  }

  getDemandesByMatricule(matricule: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/matricule?matricule=${matricule}`);
  }

  getDemandesByPeriode(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/demandes-by-periode`);
  }

  createDemandeWithDetails(demande: Demande): Observable<Demande> {
    // Set nulls for new demands
    if (demande.detailsDemandeList) {
      demande.detailsDemandeList = demande.detailsDemandeList.map(detail => ({
        ...detail,
        idTauxCrg: null,
        datePaiement: null,
        tauxCrg: null
      }));
    }
    return this.http.post<Demande>(`${this.baseUrl}`, demande);
  }

  uploadFile(formData: FormData): Observable<any> {
    return this.http.post(`${this.baseUrl}/upload`, formData);
  }

  uploadFileForDemande(fileData: FormData, idCrgDemande: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/upload-file/${idCrgDemande}`, fileData, {
      responseType: 'text'
    });
  }

  getDemandeById(idCrgDemande: string): Observable<Demande> {
    return this.http.get<Demande>(`${this.baseUrl}/${idCrgDemande}`);
  }

  getFilesByDemandeId(id: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/${id}/files`);
  }

  // Dans demande.service.ts
  findNumeroMatricule(matricule: string): Observable<string> {
    const params = new HttpParams().set('matricule', matricule);
    return this.http.get(`${this.baseUrl}/findNumeroMatricule`, {
      params: params,
      responseType: 'text' // Spécifier que la réponse est du texte brut
    });
  }

  // Dans DemandeService
  getDetailsByIdCrgDemande(idCrgDemande: string): Observable<any[]> {
    const params = new HttpParams().set('idCrgDemande', idCrgDemande);
    return this.http.get<any[]>(`${this.baseUrl}/detailsById`, { params });
  }

  getDemandesWithinDateRange(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/date-range`);
  }

  getMrDueByMonth(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/mr-due-by-month`);
  }

  getTotalDemande(): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/total-demandes`);
  }

  getDemandesTraitees(): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/demandes-traitees`);
  }

  // In demande.service.ts
  getMontantTotalDu(): Observable<string> {
    return this.http.get(this.baseUrl + '/montant-total-du', { responseType: 'text' });
  }

  getMontantTotalMajore(): Observable<string> {
    return this.http.get(this.baseUrl + '/montant-total-majore', { responseType: 'text' });
  }

  // Ajouter cette méthode
  getDemandesStats(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/demandes-stats`);
  }

  exportPdf(idCrgDemande: string): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/export-pdf/${idCrgDemande}`, { responseType: 'blob' });
  }

  getDemandesEnAttente(): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/demandes-en-attente`);
  }

  // Dans demande.service.ts
  getDemandesStatsWithRecouvrement(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/demandes-stats-recouvrement`);
  }

  getMonthlyDashboardStats(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/monthly-dashboard-stats`);
  }

  getMontantTotalParEmployeur(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/montant-total-par-employeur`);
  }

  getDemandesByDateRange(startDate: string, endDate: string): Observable<any[]> {
    // Formatage des dates au format dd/MM/yyyy
    const formattedStartDate = this.formatDate(startDate);
    const formattedEndDate = this.formatDate(endDate);

    const params = new HttpParams()
      .set('startDate', formattedStartDate)
      .set('endDate', formattedEndDate);

    return this.http.get<any[]>(`${this.baseUrl}/demandes-by-date-range`, { params });
  }

  getDemandeByMotif(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/demandes-by-motif`);
  }

  getDemandesByEmployeur(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/demandes-by-employeur`);
  }

  private formatDate(date: string): string {
    const d = new Date(date);
    const day = d.getDate().toString().padStart(2, '0');
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  }







}
