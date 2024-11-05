import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

export interface TransactionDetails {
  phoneNumber: string;
  amount: number;
  fees: boolean;  // true -> sender paie, false -> receiver paie
  receivedAmount: number;
}

export interface TransactionRequest {
  transaction: 'transfert' | 'depot' | 'retrait'|'payement';
  montant: number;
  recever_telephone?: string;
  sender_telephone?: string;
  frais?: boolean;  // true -> receiver paie, false -> sender paie
}

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private apiUrl = 'http://localhost:3000/api/v1/Transactions';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  executeTransaction( type: 'transfer' | 'deposit' | 'withdrawal' | 'payement', details: TransactionDetails): Observable<any> {
    const token = this.authService.getConnectedUserbis();
    
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    // Préparer la requête en fonction du type de transaction
    const request: TransactionRequest = {
      montant: details.amount,
      transaction: this.mapTransactionType(type),
      // Inverser la valeur de fees pour correspondre à la logique du backend
      frais: !details.fees  // Si fees est true (sender paie), on envoie false au backend
    };

    // Configurer les numéros de téléphone selon le type de transaction
    switch (type) {
      case 'transfer':
        request.recever_telephone = details.phoneNumber;
        break;
        
      case 'deposit':
        request.recever_telephone = details.phoneNumber;
        break;
        
      case 'withdrawal':
        request.sender_telephone = details.phoneNumber;
        break;
        case 'payement':
          request.recever_telephone = details.phoneNumber;
        break;
        
      
    }
  

    return this.http.post<any>(`${this.apiUrl}/create`, request, { headers });
  }

  private mapTransactionType(type: 'deposit' | 'withdrawal' | 'transfer'|'payement'): 'depot' | 'retrait' | 'transfert'|'payement' {
    switch (type) {
      case 'deposit':
        return 'depot';
      case 'withdrawal':
        return 'retrait';
      case 'transfer':
        return 'transfert';
        case 'payement':
        return 'payement';
    }
  }
}