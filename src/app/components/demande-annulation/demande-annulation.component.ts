import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface AnnulationRequest {
  id: string;
  date: Date;
  status: 'EN_ATTENTE' | 'APPROUVE' | 'REJETE';
  transactionId: string;
  montant: number;
}

@Component({
  selector: 'app-demande-annulation',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-4">
      <div *ngIf="requests.length === 0" class="text-center text-gray-500 py-8">
        <i class="fas fa-times-circle text-4xl mb-3"></i>
        <p>Aucune demande d'annulation</p>
      </div>

      <div *ngFor="let request of requests" class="bg-gray-50 p-4 rounded-lg flex justify-between items-center">
        <div>
          <p class="font-semibold">
            Annulation Transaction {{ request.transactionId }}
            <span 
              [ngClass]="{
                'text-yellow-600': request.status === 'EN_ATTENTE',
                'text-green-600': request.status === 'APPROUVE',
                'text-red-600': request.status === 'REJETE'
              }"
              class="ml-2 text-sm font-medium capitalize"
            >
              {{ getStatusLabel(request.status) }}
            </span>
          </p>
          <small class="text-gray-500">
            Montant: {{ request.montant | number:'1.2-2' }} FCFA - 
            {{ request.date | date:'dd MMM yyyy' }}
          </small>
        </div>
        <div class="flex space-x-2">
          <button 
            *ngIf="request.status === 'EN_ATTENTE'"
            class="text-red-500 hover:text-red-700 transition-colors"
          >
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>
    </div>
  `
})
export class DemandeAnnulationComponent implements OnInit {
  requests: AnnulationRequest[] = [];

  ngOnInit() {
    // Simuler des données ou appeler un service
    this.requests = [
      {
        id: '1',
        date: new Date(),
        status: 'EN_ATTENTE',
        transactionId: 'TR-2024-001',
        montant: 25000
      },
      {
        id: '2',
        date: new Date('2024-02-15'),
        status: 'REJETE',
        transactionId: 'TR-2024-002',
        montant: 15000
      }
    ];
  }

  getStatusLabel(status: 'EN_ATTENTE' | 'APPROUVE' | 'REJETE'): string {
    const labels = {
      'EN_ATTENTE': 'En Attente',
      'APPROUVE': 'Approuvé',
      'REJETE': 'Rejeté'
    };
    return labels[status];
  }
}