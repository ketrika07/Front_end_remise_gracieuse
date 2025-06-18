import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  private apiUrl = 'http://localhost:8080/demo/api/email';

  constructor(private http: HttpClient) { }

  sendEmail(idCrgDemande: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/send`, null, {
      params: { idCrgDemande }
    });
  }

}
