import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

export interface User {
  _id: string;
  telephone: string;
  nom?: string;
  prenom?: string;
  photoProfile?: string; 
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:3000/api/v1/user';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  getAllUsersExceptCurrent(): Observable<User[]> {
    const token = this.authService.getConnectedUserbis();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<User[]>(`${this.apiUrl}/all-users-except-current`, { headers });
  }
}
