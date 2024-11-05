import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private socket: Socket;
  private apiUrl = 'http://localhost:3000/api/v1/Notifications';
  private notificationsSubject = new BehaviorSubject<any[]>([]);
  public notifications$ = this.notificationsSubject.asObservable();

  constructor(private http: HttpClient) {
    this.socket = io('http://localhost:3000', {
      transports: ['websocket']
    });

    // Écouter les nouvelles notifications
    this.socket.on('new-notification', (data: any) => {
      console.log('Nouvelle notification reçue:', data);
      const currentNotifications = this.notificationsSubject.value;
      this.updateNotifications([data.notification, ...currentNotifications]);
    });
  }

  // Méthode pour mettre à jour les notifications
  updateNotifications(notifications: any[]) {
    this.notificationsSubject.next(notifications);
  }

  // Récupérer toutes les notifications avec pagination
  getAllNotifications(page: number = 1, limit: number = 10): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    return this.http.get(`${this.apiUrl}/all-notifications`, { params });
  }
}