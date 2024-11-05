// components/transaction-history/transaction-history.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Transaction {
  type: string;
  amount: string;
  date: string;
  icon: string;
  recipient: string;
}

@Component({
  selector: 'app-transaction-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl:'./transaction-history.component.html' 
    
  
})
export class TransactionHistoryComponent {
  transactions: Transaction[] = [
    {
      type: 'Dépôt de',
      amount: '10000',
      date: '29/10/2024 12h34',
      icon: 'fas fa-arrow-down',
      recipient: ''
    },
    {
      type: 'Retrait de',
      amount: '1000',
      date: '29/10/2024 12h34',
      icon: 'fas fa-arrow-up',
      recipient: ''
    },
    {
      type: 'Transfert de',
      amount: '2300',
      date: '29/10/2024 12h34',
      icon: 'fas fa-exchange-alt',
      recipient: 'Abdou'
    }
  ];
}