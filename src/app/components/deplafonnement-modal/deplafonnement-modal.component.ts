import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-deplafonnement-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div *ngIf="isOpen" class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-xl w-full max-w-lg shadow-xl">
        <!-- Header -->
        <div class="flex justify-between items-center p-6 border-b">
          <h3 class="text-lg font-semibold">Demande de Déplafonnement</h3>
          <button 
            (click)="closeModal()" 
            class="text-gray-500 hover:text-gray-700"
          >
            <i class="fas fa-times"></i>
          </button>
        </div>

        <!-- Body -->
        <form [formGroup]="deplafonnementForm" (ngSubmit)="onSubmit()" class="p-6">
          <div class="space-y-6">
            <!-- First Document Upload -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Pièce d'identité p1(obligatoire)
              </label>
              <div 
                class="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-500 transition-colors"
                [ngClass]="{'cursor-pointer': !piece1ImagePreview}"
                (click)="!piece1ImagePreview && piece1Input.click()"
              >
                <input
                  #piece1Input
                  type="file"
                  (change)="onFileSelected($event, 'piece1')"
                  accept="image/*,.pdf"
                  class="hidden"
                >
                <div *ngIf="!piece1ImagePreview" class="space-y-2">
                  <i class="fas fa-upload text-gray-400 text-2xl"></i>
                  <p class="text-sm text-gray-500">
                    Cliquez pour télécharger votre pièce d'identité
                  </p>
                </div>
                
                <div *ngIf="piece1ImagePreview" class="relative">
                  <img 
                    [src]="piece1ImagePreview" 
                    class="max-h-48 mx-auto object-contain rounded-lg"
                  >
                  <button 
                    type="button"
                    (click)="removeFile('piece1')"
                    class="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600"
                  >
                    <i class="fas fa-times"></i>
                  </button>
                </div>
              </div>
            </div>

            <!-- Second Document Upload -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
              Pièce d'identité p2 (optionnel)
              </label>
              <div 
                class="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-500 transition-colors"
                [ngClass]="{'cursor-pointer': !piece2ImagePreview}"
                (click)="!piece2ImagePreview && piece2Input.click()"
              >
                <input
                  #piece2Input
                  type="file"
                  (change)="onFileSelected($event, 'piece2')"
                  accept="image/*,.pdf"
                  class="hidden"
                >
                <div *ngIf="!piece2ImagePreview" class="space-y-2">
                  <i class="fas fa-upload text-gray-400 text-2xl"></i>
                  <p class="text-sm text-gray-500">
                    Cliquez pour télécharger un justificatif 
                  </p>
                </div>
                
                <div *ngIf="piece2ImagePreview" class="relative">
                  <img 
                    [src]="piece2ImagePreview" 
                    class="max-h-48 mx-auto object-contain rounded-lg"
                  >
                  <button 
                    type="button"
                    (click)="removeFile('piece2')"
                    class="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600"
                  >
                    <i class="fas fa-times"></i>
                  </button>
                </div>
              </div>
            </div>

            <!-- Error Message -->
            <div *ngIf="error" class="bg-red-50 text-red-500 p-4 rounded-lg text-sm">
              <i class="fas fa-exclamation-circle mr-2"></i>
              {{ error }}
            </div>
          </div>

          <!-- Footer -->
          <div class="mt-6 flex justify-end space-x-4">
            <button
              type="button"
              (click)="closeModal()"
              class="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
            >
              Annuler
            </button>
            <button
              type="submit"
              [disabled]="loading || !deplafonnementForm.valid"
              class="px-4 py-2 bg-green-300 text-white rounded-lg text-sm hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <i *ngIf="loading" class="fas fa-spinner fa-spin mr-2"></i>
              {{ loading ? 'Envoi en cours...' : 'Envoyer la demande' }}
            </button>
          </div>
        </form>
      </div>
    </div>
    <style>
      /* Général */
.modal-overlay {
    background-color: rgba(0, 0, 0, 0.5);
}

.modal-content {
    border-radius: 1rem;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.modal-header {
    border-bottom: 1px solid #e5e7eb;
}

/* Effet sur les boutons */
.modal-button-close {
    transition: color 0.2s ease;
}

.modal-button-close:hover {
    color: #1f2937;
}

.upload-container {
    border: 2px dashed #d1d5db;
    transition: border-color 0.3s ease;
}

.upload-container:hover {
    border-color: #3b82f6;
}

/* Style des boutons */
.button-primary {
    background-color: #3b82f6;
    transition: background-color 0.3s ease;
}

.button-primary:hover {
    background-color: #2563eb;
}

.button-secondary {
    color: #4b5563;
    transition: color 0.3s ease;
}

.button-secondary:hover {
    color: #1f2937;
}

/* Animation du spinner */
.spinner {
    animation: spin 1s linear infinite;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

    </style>
  `,
  styles: [`
    :host {
      display: contents;
    }
  `]
})
export class DeplafonnementModalComponent {
  @Input() isOpen = false;
  @Output() closeModalEvent = new EventEmitter<void>();
  @Output() submitRequest = new EventEmitter<FormData>();

  deplafonnementForm: FormGroup;
  loading = false;
  error = '';
  piece1ImagePreview = '';
  piece2ImagePreview = '';

  constructor(private fb: FormBuilder) {
    this.deplafonnementForm = this.fb.group({
      photoPiece1: ['', Validators.required],
      photoPiece2: ['']
    });
  }

  async onSubmit() {
    if (this.deplafonnementForm.invalid) {
      return;
    }
  
    this.loading = true;
    this.error = '';
  
    try {
      const formData = new FormData();
      const piece1File = this.deplafonnementForm.get('photoPiece1')?.value;
      const piece2File = this.deplafonnementForm.get('photoPiece2')?.value;
  
      // Vérification que piece1File existe et est un File
      if (piece1File instanceof File) {
        formData.append('photoPiece1', piece1File, piece1File.name);
      } else {
        throw new Error('Pièce d\'identité requise');
      }
      
      // Ajout de la deuxième pièce si elle existe
      if (piece2File instanceof File) {
        formData.append('photoPiece2', piece2File, piece2File.name);
      }
  
      this.submitRequest.emit(formData);
      this.closeModal();
    } catch (err) {
      this.error = err instanceof Error ? err.message : 'Une erreur est survenue lors de la soumission';
    } finally {
      this.loading = false;
    }
  }
  
  onFileSelected(event: any, pieceType: 'piece1' | 'piece2') {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        this.error = 'La taille du fichier ne doit pas dépasser 5MB';
        return;
      }
  
      // Créer un FileReader pour prévisualiser l'image
      const reader = new FileReader();
      reader.onload = (e: any) => {
        if (pieceType === 'piece1') {
          this.piece1ImagePreview = e.target.result;
          this.deplafonnementForm.patchValue({ photoPiece1: file });
        } else {
          this.piece2ImagePreview = e.target.result;
          this.deplafonnementForm.patchValue({ photoPiece2: file });
        }
      };
      reader.readAsDataURL(file);
      this.error = '';
    }
  }

  removeFile(pieceType: 'piece1' | 'piece2') {
    if (pieceType === 'piece1') {
      this.piece1ImagePreview = '';
      this.deplafonnementForm.patchValue({ photoPiece1: null });
    } else {
      this.piece2ImagePreview = '';
      this.deplafonnementForm.patchValue({ photoPiece2: null });
    }
  }

  closeModal() {
    this.closeModalEvent.emit();
  }
}