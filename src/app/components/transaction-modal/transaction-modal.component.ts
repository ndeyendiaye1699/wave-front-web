
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TransactionService } from '../../services/transaction.service';
import { UserService , User} from '../../services/userbis.service';

interface TransactionDetails {
  phoneNumber: string;
  amount: number;
  fees: boolean;
  receivedAmount: number;
  type?: 'deposit' | 'withdrawal' | 'transfer' | 'payement';
}
@Component({
  selector: 'app-transaction-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
     <div *ngIf="isOpen" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-xl bg-white">
        <!-- Header reste identique -->
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-semibold text-gray-900">
            {{ getModalTitle() }}
          </h3>
          <button 
            class="text-gray-400 hover:text-gray-500"
            (click)="close()"
          >
            <i class="fas fa-times"></i>
          </button>
        </div>

        <!-- Step indicator reste identique -->
        <div class="flex justify-between mb-8">
          <div class="flex items-center">
            <div [class]="getStepClass(1)">1</div>
            <div class="h-1 w-12 bg-gray-200" [class.bg-blue-500]="currentStep >= 2"></div>
            <div [class]="getStepClass(2)">2</div>
          </div>
        </div>

        <!-- Step 1: Phone Number -->
        <div *ngIf="currentStep === 1">
          <!-- User list for transfers -->
          <div *ngIf="type === 'transfer'" class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Sélectionner un destinataire ou Donner un numéro
            </label>
            <div class="space-y-2 max-h-60 overflow-y-auto">
              <div *ngFor="let user of users" 
                   class="flex items-center p-3 rounded-lg hover:bg-gray-50 cursor-pointer border transition-all duration-200"
                   [class.border-blue-500]="selectedUserId === user._id"
                   [class.bg-blue-50]="selectedUserId === user._id"
                   (click)="toggleUser(user)">
                <div class="flex items-center flex-1">
                  <div class="w-12 h-12 rounded-full overflow-hidden bg-gray-200 mr-3 flex-shrink-0">
                    <img 
                      [src]="user.photoProfile || '/assets/default-avatar.png'" 
                      alt="Profile"
                      class="w-full h-full object-cover"
                      onerror="this.src='/assets/default-avatar.png'"
                    >
                  </div>
                  
                  <div class="flex-1">
                    <div class="text-sm font-medium text-gray-900">
                      {{ user.prenom }} {{ user.nom }}
                    </div>
                    <div class="text-sm text-gray-500">
                      {{ user.telephone }}
                    </div>
                  </div>
                  
                  <div class="w-5 h-5 border-2 rounded flex items-center justify-center transition-all duration-200"
                       [class.border-blue-500]="selectedUserId === user._id"
                       [class.bg-blue-500]="selectedUserId === user._id">
                    <div *ngIf="selectedUserId === user._id" 
                         class="text-white text-xs transform transition-transform duration-200 scale-100">✓</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              {{ getPhoneNumberLabel() }}
            </label>
            <input
              type="tel"
              [(ngModel)]="transaction.phoneNumber"
              (ngModelChange)="onPhoneNumberChange($event)"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Entrez le numéro"
            >
          </div>
          
          <div class="flex space-x-3">
            <button
              (click)="close()"
              class="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
            >
              Annuler
            </button>
            <button
              (click)="nextStep()"
              [disabled]="!transaction.phoneNumber"
              class="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200"
            >
              Suivant
            </button>
          </div>
        </div>

        <!-- Step 2: Amount -->
        <div *ngIf="currentStep === 2">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                {{ getAmountLabel() }}
              </label>
              <input
                type="number"
                [(ngModel)]="transaction.amount"
                (ngModelChange)="calculateReceivedAmount()"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="0 FCFA"
              >
            </div>

            <!-- Fees Toggle - Only shown for transfers -->
            <div *ngIf="type === 'transfer'" class="flex items-center justify-between">
              <span class="text-sm text-gray-700">Frais à la charge du destinataire</span>
              <button
                (click)="toggleFees()"
                class="relative inline-flex h-6 w-11 items-center rounded-full"
                [class.bg-blue-600]="transaction.fees"
                [class.bg-gray-200]="!transaction.fees"
              >
                <span
                  class="inline-block h-4 w-4 transform rounded-full bg-white transition"
                  [class.translate-x-6]="transaction.fees"
                  [class.translate-x-1]="!transaction.fees"
                ></span>
              </button>
            </div>

            <!-- Final Amount Display -->
            <div class="bg-gray-50 p-4 rounded-lg">
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-600">
                  {{ getFinalAmountLabel() }}
                </span>
                <span class="font-semibold">
                  {{ transaction.receivedAmount | number:'1.0-0' }} FCFA
                </span>
              </div>
            </div>

            <div class="flex space-x-3">
              <button
                (click)="previousStep()"
                class="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200"
              >
                Retour
              </button>
              <button
                (click)="confirm()"
                [disabled]="!transaction.amount"
                class="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Confirmer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <style>
  /* Styles généraux pour la modal */
.fixed {
    backdrop-filter: blur(5px); /* Applique le flou à l'arrière-plan */
}

.relative {
    background-color: rgba(255, 255, 255, 0.9); /* Couleur de fond blanche avec une légère transparence */
    border-radius: 1rem;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

/* Couleur et style du texte des titres */
.text-gray-900 {
    color: #1f2937; /* Couleur du texte plus sombre pour un meilleur contraste */
}

/* Styles pour les étiquettes */
.label {
    color: #4b5563; /* Couleur légèrement plus sombre */
    font-weight: 600; /* Mettre en gras les étiquettes */
}

/* Styles des champs d'entrée */
input[type="tel"],
input[type="number"] {
    border: 2px solid #f59e0b; /* Bordure orange douce */
    border-radius: 0.5rem; /* Coins arrondis */
    padding: 0.75rem; /* Espacement interne */
    transition: border-color 0.3s; /* Transition pour un changement de bordure */
}

input[type="tel"]:focus,
input[type="number"]:focus {
    border-color: #ea580c; /* Couleur de bordure orange plus foncée au focus */
    outline: none; /* Enlever le contour par défaut */
}

/* Styles des boutons */
button {
    transition: background-color 0.3s, transform 0.2s; /* Transition douce */
}

button:hover {
    transform: translateY(-2px); /* Léger déplacement vers le haut au survol */
}

/* Styles pour le bouton "Annuler" */
.bg-gray-100 {
    background-color: #fde68a; /* Couleur de fond orange pâle */
    color: #78350f; /* Couleur de texte orange foncé */
}

.bg-gray-100:hover {
    background-color: #fbbf24; /* Couleur orange plus vive au survol */
}

/* Styles pour le bouton "Suivant" et "Confirmer" */
.bg-blue-600 {
    background-color: #f97316; /* Couleur orange */
}

.bg-blue-600:hover {
    background-color: #ea580c; /* Couleur orange plus foncée au survol */
}

/* Styles pour le sélecteur de frais */
.relative {
    transition: background-color 0.3s; /* Transition douce pour le sélecteur */
}

.bg-blue-600 {
    background-color: #f97316; /* Couleur orange */
}

/* Styles pour le conteneur des frais */
.bg-gray-50 {
    background-color: #fff7ed; /* Couleur de fond douce pour le conteneur */
    padding: 1rem; /* Espacement interne */
    border-radius: 0.5rem; /* Coins arrondis */
}

/* Styles pour les messages de confirmation */
.text-sm.text-gray-600 {
    color: #d97706; /* Couleur de texte orange pour les confirmations */
}


    </style>
`
})
export class TransactionModalComponent {
  @Input() isOpen = false;
  @Input() type: 'deposit' | 'withdrawal' | 'transfer' | 'payement' = 'payement';
  @Output() closeModal = new EventEmitter<void>();
  @Output() confirmTransaction = new EventEmitter<TransactionDetails>();
  users: User[] = [];
  selectedUserId: string = '';
  currentStep = 1;
  transaction: TransactionDetails = {
    phoneNumber: '',
    amount: 0,
    fees: false,
    receivedAmount: 0
  };

  constructor(private transactionService: TransactionService,
    private userService: UserService,
  ) {}
  ngOnInit() {
    if (this.type === 'transfer') {
      this.loadUsers();
    }
  }

  loadUsers() {
    this.userService.getAllUsersExceptCurrent().subscribe({
      next: (users) => {
        this.users = users;
      },
      error: (error) => {
        console.error('Erreur lors de la récupération des utilisateurs:', error);
      }
    });
  }
  onPhoneNumberChange(phoneNumber: string) {
    // Si l'utilisateur saisit manuellement un numéro différent, on désélectionne l'utilisateur
    if (this.selectedUserId && this.users.find(u => u._id === this.selectedUserId)?.telephone !== phoneNumber) {
      this.selectedUserId = '';
    }
  }
  toggleUser(user: User) {
    if (this.selectedUserId === user._id) {
      // Décocher l'utilisateur
      this.selectedUserId = '';
      this.transaction.phoneNumber = '';
    } else {
      // Cocher l'utilisateur
      this.selectedUserId = user._id;
      this.transaction.phoneNumber = user.telephone;
    }
  }

  selectUser(user: User) {
    this.selectedUserId = user._id;
    this.transaction.phoneNumber = user.telephone;
  }


  getModalTitle(): string {
    switch (this.type) {
      case 'deposit':
        return 'Dépôt d\'argent';
      case 'withdrawal':
        return 'Retrait d\'argent';
      case 'payement':
        return 'Paiement marchand';
      default:
        return 'Transfert d\'argent';
    }
  }

  getPhoneNumberLabel(): string {
    switch (this.type) {
      case 'deposit':
        return 'Numéro du bénéficiaire';
      case 'withdrawal':
        return 'Numéro du client';
      case 'payement':
        return 'Numéro du marchand';
      default:
        return 'Numéro du destinataire';
    }
  }

  getAmountLabel(): string {
    switch (this.type) {
      case 'deposit':
        return 'Montant à déposer';
      case 'withdrawal':
        return 'Montant à retirer';
      case 'payement':
        return 'Montant à payer';
      default:
        return 'Montant à envoyer';
    }
  }

  getFinalAmountLabel(): string {
    switch (this.type) {
      case 'payement':
        return 'Montant total à payer';
      case 'transfer':
        return 'Montant à recevoir';
      default:
        return 'Montant total';
    }
  }

  getStepClass(step: number): string {
    const baseClass = 'w-8 h-8 rounded-full flex items-center justify-center text-sm';
    if (step === this.currentStep) {
      return `${baseClass} bg-blue-500 text-white`;
    }
    if (step < this.currentStep) {
      return `${baseClass} bg-blue-500 text-white`;
    }
    return `${baseClass} bg-gray-200 text-gray-600`;
  }

  calculateReceivedAmount(): void {
    if (this.type === 'transfer') {
      const feePercentage = this.transaction.fees ? 0.01 : 0;
      const fees = this.transaction.amount * feePercentage;
      this.transaction.receivedAmount = this.transaction.amount - fees;
    } else {
      // Pour les autres types de transaction, y compris le paiement
      this.transaction.receivedAmount = this.transaction.amount;
    }
  }

  toggleFees(): void {
    this.transaction.fees = !this.transaction.fees;
    this.calculateReceivedAmount();
  }

  nextStep(): void {
    if (this.currentStep < 2) {
      this.currentStep++;
    }
  }

  previousStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  confirm(): void {
    this.transactionService.executeTransaction(this.type, this.transaction)
      .subscribe({
        next: (response) => {
          console.log('Transaction réussie:', response);
          this.confirmTransaction.emit(this.transaction);
          this.resetAndClose();
        },
        error: (error) => {
          console.error('Erreur lors de la transaction:', error);
          alert(error.error.message || 'Une erreur est survenue lors de la transaction');
        }
      });
  }

  close(): void {
    this.resetAndClose();
  }

  private resetAndClose(): void {
    this.isOpen = false;
    this.closeModal.emit();
    this.currentStep = 1;
    this.transaction = {
      phoneNumber: '',
      amount: 0,
      fees: false,
      receivedAmount: 0
    };
  }
}