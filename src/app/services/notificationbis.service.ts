import { Injectable } from '@angular/core';
import { HttpClient, HttpParams,HttpHeaders } from '@angular/common/http';
import { Observable,of  } from 'rxjs';
import { AuthService } from './auth.service';
import { catchError } from 'rxjs/operators';



// Interfaces pour typer les données
export interface NotificationResponse {
  success: boolean;
  data: {
    notifications: Notification[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      itemsPerPage: number;
    };
  };
}

export interface Notification {
  _id: string;
  compte: string;
  message: string;
  type: 'TRANSFERT_RECU' | 'TRANSFERT_ENVOYE' | 'PAIEMENT';
  montant: number;
  date: string;
  etat: boolean;
}
@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private apiUrl = 'http://localhost:3000/api/v1/Notifications';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  getUserNotifications(page: number = 1, limit: number = 10, month?: string): Observable<NotificationResponse> {
    const token = this.authService.getConnectedUserbis();
    if (!token) {
        throw new Error('No token found');
    }

    const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    });

    let params = new HttpParams()
        .set('page', page.toString())
        .set('limit', limit.toString());

    // N'ajouter le mois que s'il est défini et non vide
    if (month !== undefined && month !== '' && month !== null) {
        params = params.set('month', month);
    }

    return this.http.get<NotificationResponse>(
        `${this.apiUrl}/user-notifications`,
        { headers, params }
    ).pipe(
        catchError(error => {
            console.error('Error fetching notifications:', error);
            // Retourner un observable avec une réponse par défaut en cas d'erreur
            return of({
                success: false,
                data: {
                    notifications: [],
                    pagination: {
                        currentPage: 1,
                        totalPages: 0,
                        totalItems: 0,
                        itemsPerPage: limit
                    }
                }
            });
        })
    );
}

  markAsRead(notificationId: string): Observable<any> {
    const user = this.authService.getConnectedUser();
    if (!user) {
      throw new Error('No user connected');
    }

    return this.http.patch(
      `${this.apiUrl}/notifications/${notificationId}`,
      { etat: true }
    );
  }

  markAllAsRead(): Observable<any> {
    const user = this.authService.getConnectedUser();
    if (!user) {
      throw new Error('No user connected');
    }

    return this.http.patch(
      `${this.apiUrl}/notifications/mark-all-read/${user.id}`,
      {}
    );
  }

  // Méthode optionnelle pour écouter les notifications en temps réel via WebSocket
  subscribeToNotifications(callback: (notification: Notification) => void) {
    // Implémentez ici la logique WebSocket si nécessaire
    // Vous pouvez utiliser socket.io-client ou le WebSocket natif
  }
}