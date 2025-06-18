import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DetailsDemande } from '../model/DetailsDemande';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DetailsDemandeService {

  private apiUrl = 'http://localhost:8080/demo/api/detailsDemande'; // Remplacez par l'URL de votre API

  constructor(private http: HttpClient) { }

  appliquerSanction(idDetCrgDmd: string): Observable<DetailsDemande> {
    return this.http.post<DetailsDemande>(`${this.apiUrl}/appliquer-sanction/${idDetCrgDmd}`, {});
  }

  
  addObservation(idDetCrgDmd: string, observation: string): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'text/plain');
    return this.http.put<any>(
      `${this.apiUrl}/${idDetCrgDmd}/observation`,
      observation,
      { headers: headers }
    );
  }
}
