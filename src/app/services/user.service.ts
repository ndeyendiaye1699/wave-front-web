import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface UserRegistrationData {
  nom: string;
  prenom: string;
  telephone: string;
  mdp: string;
  confirmMdp: string;
  role: string;
  photoProfile?: File;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:3000/api/v1/user'; // Remplacez par votre URL d'API

  constructor(private http: HttpClient) {}

  createUser(userData: UserRegistrationData): Observable<any> {
    const formData = new FormData();
    
    // Ajout des champs texte
    formData.append('nom', userData.nom);
    formData.append('prenom', userData.prenom);
    formData.append('telephone', userData.telephone);
    formData.append('mdp', userData.mdp);
    formData.append('confirmMdp', userData.confirmMdp);
    formData.append('role', userData.role);
    
    // Ajout de la photo si elle existe
    if (userData.photoProfile) {
      formData.append('photoProfile', userData.photoProfile);
    }

    return this.http.post(`${this.apiUrl}/create`, formData);
  }
  
}