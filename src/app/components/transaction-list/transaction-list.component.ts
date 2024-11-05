// Fichier: components/transaction-list.component.ts
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Transaction } from '../../models/transaction.model';

@Component({
  selector: 'app-transaction-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white rounded-xl shadow-sm p-4 sm:p-6">
      <div class="flex justify-between items-center mb-6">
        <h3 class="font-semibold">Historique des Transactions</h3>
        <button class="flex items-center space-x-2 text-gray-500 text-sm sm:text-base">
          <span>Ce Mois</span>
          <i class="fas fa-chevron-down"></i>
        </button>
      </div>
      
      <div class="space-y-4">
        <div *ngFor="let transaction of transactions" 
             class="bg-gray-50 p-4 rounded-xl hover:shadow-md transition-shadow w-full">
          <div class="flex items-start justify-between mb-3">
            <div class="flex items-center space-x-3">
              <div [class]="getTransactionIconClass(transaction.type)">
                <i [class]="getTransactionIcon(transaction.type)"></i>
              </div>
              <div>
                <p class="font-semibold text-sm sm:text-base">
                  {{ getTransactionTitle(transaction) }}
                </p>
                <p class="text-xs sm:text-sm text-gray-500">
                  {{ transaction.date }}
                </p>
              </div>
            </div>
            <span [class]="getAmountClass(transaction)">
              {{ getAmountDisplay(transaction) }}
            </span>
          </div>
          <div class="text-xs sm:text-sm text-gray-500">
            Nouveau solde: {{ transaction.newBalance | number:'1.2-2' }} FCFA
          </div>
          <div class="mt-3 pt-3 border-t border-gray-200 flex justify-between items-center">
            <span [class]="getStatusBadgeClass(transaction.status)">
              {{ transaction.status }}
            </span>
            <button class="text-blue-600 text-xs sm:text-sm hover:underline">
              Détails
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class TransactionListComponent {
  @Input() transactions: Transaction[] = [];

  getTransactionIconClass(type: string): string {
    const baseClasses = 'w-10 h-10 rounded-full flex items-center justify-center';
    switch (type) {
      case 'TRANSFERT_RECU':
        return `${baseClasses} bg-green-50`;
      case 'TRANSFERT_ENVOYE':
        return `${baseClasses} bg-red-50`;
      case 'PAIEMENT':
        return `${baseClasses} bg-blue-50`;
      default:
        return baseClasses;
    }
  }

  getTransactionIcon(type: string): string {
    switch (type) {
      case 'TRANSFERT_RECU':
        return 'fas fa-arrow-down text-green-500';
      case 'TRANSFERT_ENVOYE':
        return 'fas fa-arrow-up text-red-500';
      case 'PAIEMENT':
        return 'fas fa-shopping-cart text-blue-500';
      default:
        return 'fas fa-exchange-alt';
    }
  }

  getTransactionTitle(transaction: Transaction): string {
    switch (transaction.type) {
      case 'TRANSFERT_RECU':
        return `Reçu de ${transaction.sender}`;
      case 'TRANSFERT_ENVOYE':
        return `Envoyé à ${transaction.receiver}`;
      case 'PAIEMENT':
        return `Paiement à ${transaction.receiver}`;
      default:
        return 'Transaction';
    }
  }
  getAmountClass(transaction: Transaction): string {
    const baseClasses = 'font-semibold';
    switch (transaction.type) {
      case 'TRANSFERT_RECU':
        return `${baseClasses} text-green-500`;
      case 'TRANSFERT_ENVOYE':
      case 'PAIEMENT':
        return `${baseClasses} text-red-500`;
      default:
        return baseClasses;
    }
  }


  getAmountDisplay(transaction: Transaction): string {
    const prefix = transaction.type === 'TRANSFERT_RECU' ? '+' : '-';
    return `${prefix}${transaction.amount.toLocaleString()} FCFA`;
  }


  getStatusBadgeClass(status: string): string {
    const baseClasses = 'px-3 py-1 rounded-full text-xs';
    switch (status) {
      case 'Completed':
        return `${baseClasses} bg-green-50 text-green-600`;
      case 'Pending':
        return `${baseClasses} bg-yellow-50 text-yellow-600`;
      case 'Failed':
        return `${baseClasses} bg-red-50 text-red-600`;
      default:
        return baseClasses;
    }
  }
}