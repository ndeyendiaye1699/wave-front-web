import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

export interface Compte {
  solde: number;
  soldeMaximum: number;
  etat: 'ACTIF' | 'INACTIF' | 'SUSPENDU';
  cummulTransactionMensuelle: number;
  qrcode: string;
}

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private apiUrl = 'http://localhost:3000/api/v1';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getConnectedUserbis();
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getCompteDetails(): Observable<any> {
    return this.http.get(`${this.apiUrl}/compte/mon-compte`, {
      headers: this.getHeaders()
    });
  }
}