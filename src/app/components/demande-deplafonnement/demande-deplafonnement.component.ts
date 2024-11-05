import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DeplafonnementService } from '../../services/deplafonnementbis.service';
import { DeplafonnementRequest, ValidateDeplafonnementDto } from '../../services/interfaces/deplafonnement.interface';

@Component({
  selector: 'app-demande-deplafonnement',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="space-y-4"> 
      <div *ngIf="requests.length === 0" class="text-center text-gray-500 py-8">
        <p>Aucune demande pour l'instant</p>
      </div>

      <div *ngFor="let request of pagedRequests" class="bg-white shadow-md p-4 rounded-lg mb-4">
        <div class="flex justify-between items-start">
          <div class="flex items-center space-x-4">
            <img 
              [src]="request.photoProfile || 'assets/default-avatar.png'" 
              alt="Profile" 
              class="w-12 h-12 rounded-full object-cover"
              (error)="handleImageError($event)"
            >
            <div>
              <p class="font-semibold">{{ request.nomUtilisateur || 'N/A' }} {{ request.prenomUtilisateur || 'N/A' }}</p>
              <p class="text-sm text-gray-500">
                Demande soumise le {{ request.createdAt | date:'dd/MM/yyyy à HH:mm' }}
              </p>
            </div>
          </div>
          <span 
            class="px-3 py-1 rounded-full text-sm"
            [ngClass]="{
              'bg-yellow-100 text-yellow-800': request.status === 'EN_COURS',
              'bg-green-100 text-green-800': request.status === 'VALIDÉ',
              'bg-red-100 text-red-800': request.status === 'REJETÉ'
            }"
          >
            {{ request.status }}
          </span>
        </div>

        <div class="mt-4 grid grid-cols-2 gap-4">
          <div>
            <img 
              [src]="request.photoPiece1" 
              alt="Pièce 1" 
              class="w-full h-32 object-cover rounded cursor-pointer"
              (click)="openImageModal(request.photoPiece1)"
              (error)="handleImageError($event)"
            >
            <p class="text-sm text-gray-500 mt-1">Pièce 1</p>
          </div>
          <div *ngIf="request.photoPiece2">
            <img 
              [src]="request.photoPiece2" 
              alt="Pièce 2" 
              class="w-full h-32 object-cover rounded cursor-pointer"
              (click)="openImageModal(request.photoPiece2)"
              (error)="handleImageError($event)"
            >
            <p class="text-sm text-gray-500 mt-1">Pièce 2</p>
          </div>
        </div>

        <div class="mt-4" *ngIf="request.status === 'EN_COURS'">
          <form [formGroup]="validationForm" (ngSubmit)="validateRequest(request._id)" class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">Solde Maximum</label>
                <input 
                  type="number"
                  formControlName="soldeMaximum"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Cumul Transaction Mensuelle</label>
                <input 
                  type="number"
                  formControlName="cummulTransactionMensuelle"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
              </div>
            </div>
            <div class="flex justify-end">
              <button
                type="submit"
                [disabled]="!validationForm.valid"
                class="px-4 py-2 text-white bg-green-600 rounded hover:bg-green-700 transition-colors disabled:bg-gray-400"
              >
                Confirmer
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Pagination -->
      <div class="flex justify-center space-x-2 mt-4">
        <button
          *ngFor="let page of getPageNumbers()"
          [class.bg-blue-500]="currentPage === page"
          [class.text-white]="currentPage === page"
          class="px-3 py-1 rounded border"
          (click)="setPage(page)"
        >
          {{ page }}
        </button>
      </div>

      <!-- Modal pour afficher les images en grand -->
      <div *ngIf="selectedImage" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" (click)="selectedImage = null">
        <img [src]="selectedImage" class="max-h-[90vh] max-w-[90vw] object-contain">
      </div>
    </div>
  `,
})
export class DemandeDeplafonnementComponent implements OnInit {
  requests: DeplafonnementRequest[] = [];
  pagedRequests: DeplafonnementRequest[] = [];
  currentPage = 1;
  pageSize = 1;
  validationForm: FormGroup;
  selectedImage: string | null = null;

  constructor(
    private deplafonnementService: DeplafonnementService,
    private fb: FormBuilder
  ) {
    this.validationForm = this.fb.group({
      soldeMaximum: ['', [Validators.required, Validators.min(0)]],
      cummulTransactionMensuelle: ['', [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit() {
    this.loadPendingRequests();
  }

  loadPendingRequests() {
    this.deplafonnementService.getPendingRequests().subscribe({
      next: (response) => {
        this.requests = response.requests;
        this.updatePagedRequests();
      },
      error: (error) => {
        console.error('Erreur lors du chargement des demandes:', error);
      }
    });
  }

  validateRequest(requestId: string) {
    if (this.validationForm.valid) {
      const data: ValidateDeplafonnementDto = this.validationForm.value;

      this.deplafonnementService.validateRequest(requestId, data).subscribe({
        next: () => {
          this.loadPendingRequests();
          this.validationForm.reset();
        },
        error: (error) => {
          console.error('Erreur lors de la validation:', error);
        }
      });
    }
  }

  handleImageError(event: any) {
    event.target.src = 'assets/default-image.png';
  }

  openImageModal(imageUrl: string) {
    this.selectedImage = imageUrl;
  }

  // Pagination methods
  updatePagedRequests() {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.pagedRequests = this.requests.slice(start, end);
  }

  setPage(page: number) {
    this.currentPage = page;
    this.updatePagedRequests();
  }

  getPageNumbers(): number[] {
    const pageCount = Math.ceil(this.requests.length / this.pageSize);
    return Array.from({ length: pageCount }, (_, i) => i + 1);
  }
}