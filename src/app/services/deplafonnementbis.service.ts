import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { DeplafonnementRequest, ValidateDeplafonnementDto } from './interfaces/deplafonnement.interface';

@Injectable({
  providedIn: 'root'
})
export class DeplafonnementService {
  private readonly apiUrl = 'http://localhost:3000/api/v1/deplafonnement';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getConnectedUserbis();
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getPendingRequests(): Observable<{ message: string; requests: DeplafonnementRequest[] }> {
    return this.http.get<{ message: string; requests: DeplafonnementRequest[] }>(
      `${this.apiUrl}/pending`,
      { headers: this.getHeaders() }
    );
  }

  validateRequest(requestId: string, data: ValidateDeplafonnementDto): Observable<{ message: string; request: DeplafonnementRequest }> {
    return this.http.post<{ message: string; request: DeplafonnementRequest }>(
      `${this.apiUrl}/validate/${requestId}`,
      data,
      { headers: this.getHeaders() }
    );
  }
}