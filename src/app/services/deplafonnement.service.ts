import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

export interface DeplafonnementResponse {
  message: string;
  request: {
    id: string;
    utilisateur: string;
    photoPiece1: string;
    photoPiece2?: string;
    status: 'EN_COURS' | 'APPROUVE' | 'REJETE';
    createdAt: string;
    updatedAt: string;
  };
}

export interface DeplafonnementRequest {
  photoPiece1: File;
  photoPiece2?: File;
}

@Injectable({
  providedIn: 'root'
})
export class DeplafonnementService {
  private apiUrl = 'http://localhost:3000/api/v1/deplafonnement';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  requestDeplafonnement(formData: FormData): Observable<DeplafonnementResponse> {
    const token = this.authService.getConnectedUserbis();
    
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
      // Ne pas définir 'Content-Type' car il sera automatiquement défini avec la boundary pour FormData
    });
  
    return this.http.post<DeplafonnementResponse>(
      `${this.apiUrl}/request`,
      formData,
      { 
        headers,
        // Ajout de withCredentials si nécessaire pour les cookies
        withCredentials: true 
      }
    );
  }

  // Obtenir le statut d'une demande spécifique
  getRequestStatus(requestId: string): Observable<DeplafonnementResponse> {
    const token = this.authService.getConnectedUserbis();
    
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<DeplafonnementResponse>(
      `${this.apiUrl}/status/${requestId}`,
      { headers }
    );
  }

  // Obtenir toutes les demandes de l'utilisateur
  getUserRequests(): Observable<DeplafonnementResponse[]> {
    const token = this.authService.getConnectedUserbis();
    
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<DeplafonnementResponse[]>(
      `${this.apiUrl}/user-requests`,
      { headers }
    );
  }

  // Annuler une demande
  cancelRequest(requestId: string): Observable<{ message: string }> {
    const token = this.authService.getConnectedUserbis();
    
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.delete<{ message: string }>(
      `${this.apiUrl}/cancel/${requestId}`,
      { headers }
    );
  }
}
