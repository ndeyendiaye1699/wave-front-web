import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stats-cards',
  standalone: true,
  imports: [CommonModule],
  templateUrl:'./stats-cards.component.html' 
   
})
export class StatsCardsComponent {
  @Input() totalVolume = 0;
  @Input() totalTransactions = 0;
  @Input() averageTransaction = 0;
}
