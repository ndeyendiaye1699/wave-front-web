import { Component ,EventEmitter , Output} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DemandeAnnulationComponent } from '../demande-annulation/demande-annulation.component';
import { DemandeDeplafonnementComponent } from '../demande-deplafonnement/demande-deplafonnement.component';
import { } from '@angular/core';

@Component({
  selector: 'app-demande-request',
  standalone: true,
  imports: [
    CommonModule, 
    DemandeDeplafonnementComponent, 
    DemandeAnnulationComponent
  ],
  template: `
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" (click)="onBackdropClick($event)">
      <div class="bg-white rounded-xl shadow-lg w-11/12 max-w-4xl max-h-[90vh] overflow-hidden" (click)="$event.stopPropagation()">
        <div class="bg-gray-50 p-4 border-b flex justify-between items-center">
          <h2 class="text-xl font-semibold text-gray-800">Mes Demandes</h2>
          <button 
            (click)="closeModal()"
            class="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <i class="fas fa-times text-xl"></i>
          </button>
        </div>
        
        <div class="flex border-b">
          <button 
            (click)="selectTab($event, 'deplafonnement')"
            [class]="selectedTab === 'deplafonnement' ? 'bg-blue-50 text-blue-600 border-blue-500' : 'text-gray-600 hover:bg-gray-100'"
            class="flex-1 py-3 px-4 border-b-2 font-semibold transition-all"
          >
            <i class="fas fa-chart-line mr-2"></i>Demandes de Déplafonnement
          </button>
          <button 
            (click)="selectTab($event, 'annulation')"
            [class]="selectedTab === 'annulation' ? 'bg-blue-50 text-blue-600 border-blue-500' : 'text-gray-600 hover:bg-gray-100'"
            class="flex-1 py-3 px-4 border-b-2 font-semibold transition-all"
          >
            <i class="fas fa-times-circle mr-2"></i>Demandes d'Annulation
          </button>
        </div>
        
        <div class="p-4 overflow-y-auto max-h-[60vh]">
          <app-demande-deplafonnement *ngIf="selectedTab === 'deplafonnement'"></app-demande-deplafonnement>
          <app-demande-annulation *ngIf="selectedTab === 'annulation'"></app-demande-annulation>
        </div>
      </div>
    </div>
    <style>
      
    </style>
  `,
  styles: [`
    :host {
      display: block;
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 1000;
    }
    
  `]
})
export class DemandeRequestComponent {
  @Output() modalClose = new EventEmitter<void>();
  selectedTab: 'deplafonnement' | 'annulation' = 'deplafonnement';

  closeModal() {
    this.modalClose.emit();
  }

  selectTab(event: MouseEvent, tab: 'deplafonnement' | 'annulation') {
    event.preventDefault();
    this.selectedTab = tab;
  }

  onBackdropClick(event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains('bg-black')) {
      this.closeModal();
    }
  }
}