import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, catchError } from 'rxjs';
import { Router } from '@angular/router';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/v1/user'; 
  private readonly AUTH_KEY = 'auth_token';
  private readonly USER_KEY = 'user_connected';
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasToken());

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  login(credentials: { telephone: string; password: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, {
      telephone: credentials.telephone,
      mdp: credentials.password
    }).pipe(
      tap(response => {
        if (response.data?.token) {
          // Stocker le token
          localStorage.setItem(this.AUTH_KEY, response.data.token);
       /*    console.log(response.data.token); */
          // Stocker les données de l'utilisateur
          localStorage.setItem(this.USER_KEY, JSON.stringify(response.data)); // Enregistrer toutes les données de l'utilisateur
          console.log("User data stored in localStorage:", response.data);
          this.isAuthenticatedSubject.next(true);
        } else {
          console.warn("Login response does not contain user data.");
        }
      }),
      catchError(error => {
        console.error("Login failed", error);
        return of(null); // ou renvoyer une erreur personnalisée
      })
    );
  }
  
  logout(): void {
    localStorage.removeItem(this.AUTH_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(['/login']);
  }

  getConnectedUser(): any {
    const userData = localStorage.getItem(this.USER_KEY);
   
    return userData ? JSON.parse(userData) : null;
  }
  getConnectedUserbis(): string | null {
    const token = localStorage.getItem(this.AUTH_KEY);
    //console.log(token);
    return token; // Retourner le token directement sans le parser
  }
  getToken(): string | null {
    const token = localStorage.getItem(this.AUTH_KEY);
console.log(token)
    return token ? JSON.parse(token):null;
  }

  isAuthenticated(): Observable<boolean> {
    return this.isAuthenticatedSubject.asObservable();
  }

  private hasToken(): boolean {
    return !!localStorage.getItem(this.AUTH_KEY);
  }
}
