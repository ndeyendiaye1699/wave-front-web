// Fichier: components/balance-card.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-balance-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './balance-card.component.html'
    
})
export class BalanceCardComponent {
  @Input() balance = 0;
  @Input() hideBalance = false;
  @Input() totalSent = 0;
  @Input() totalReceived = 0;
  @Input() totalFees = 0;
  @Output() toggleBalance = new EventEmitter<void>();
}
