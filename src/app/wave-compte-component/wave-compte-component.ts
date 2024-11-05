import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { NotificationService, Notification } from '../services/notificationbis.service';
import { AuthService } from '../services/auth.service';
import { AccountService, Compte } from '../services/account.service';
import { TransactionModalComponent } from '../components/transaction-modal/transaction-modal.component';
import { DeplafonnementModalComponent } from '../components/deplafonnement-modal/deplafonnement-modal.component';
import { DeplafonnementService } from '../services/deplafonnement.service';
import { DemandeRequestComponent } from '../components/demande-request/demande-request.component';
import { QrCodeComponent } from '../components/qr-code/qr-code.component';
interface Transaction {
  id: string;
  type: 'TRANSFERT_RECU' | 'TRANSFERT_ENVOYE' | 'PAIEMENT';
  sender?: string;
  receiver?: string;
  amount: number;
  newBalance: number;
  date: string;
  status: 'Completed' | 'Pending' | 'Failed';
}

@Component({
  selector: 'app-wave-desktop',
  standalone: true,
  imports: [CommonModule,TransactionModalComponent, FormsModule,DeplafonnementModalComponent,DemandeRequestComponent, QrCodeComponent ],
  templateUrl: './wave-compte-component.html', // Assure-toi que ce fichier existe
  styleUrl: './wave-compte-component.css',
  
})

export class WaveCompteComponent {
  demandeModalOpen = false;
  deplafonnementModalOpen = false;
  transactionModalOpen = false;
  transactionType: 'deposit' | 'withdrawal' | 'transfer' | 'payement' = 'transfer';
  compte: Compte | null = null;
  notifications: Notification[] = [];
  showProfileMenu = false;
  hideBalance = false;
    balance:any;
  totalSent = 2500;
  totalReceived = 3688;
  totalFees = 150; 
  totalVolume = 6188;
  totalTransactions = 15;
  averageTransaction = 412.53;
  userConnected: any = null;
  userPhoto: string = '';
  isAgentOrAdmin: boolean = false;
  currentPage = 1;
  totalPages = 1;
  itemsPerPage = 5;
  totalItems = 0;
  selectedMonth = '';

  constructor(private notificationService: NotificationService

    ,
    private authService: AuthService,
    private accountService: AccountService,
    private deplafonnementService: DeplafonnementService
  ){}
  ngOnInit() {
    this.getNotifications();
    this.loadNotifications();
    this.loadCompteDetails();
    this.loadUserData();
  }
  loadUserData() {
    const userData = this.authService.getConnectedUser();
    if (userData) {
      this.userConnected = userData;
      this.userPhoto = userData.photoProfile || '/api/placeholder/40/40'; // Fallback to placeholder if no photo
      this.isAgentOrAdmin = ['AGENT', 'ADMIN'].includes(userData.role);
    }
  }
  loadNotifications() {
    this.notificationService.getUserNotifications(
        this.currentPage,
        this.itemsPerPage,
        this.selectedMonth
    ).subscribe({
        next: (response) => {
            if (response.success) {
                this.notifications = response.data.notifications;
                this.totalPages = response.data.pagination.totalPages;
                this.totalItems = response.data.pagination.totalItems;

                // Réajuster la page si elle dépasse le nombre de pages
                if (this.currentPage > this.totalPages) {
                    this.currentPage = this.totalPages || 1;
                    this.loadNotifications(); // Recharge avec la nouvelle page
                }
            } else {
                console.error('Failed to load notifications', response);
                this.notifications = [];
                this.totalPages = 0;
                this.totalItems = 0;
            }
        },
        error: (error) => {
            console.error('Error fetching notifications:', error);
            this.notifications = [];
            this.totalPages = 0;
            this.totalItems = 0;
        }
    });
}
filterByMonth() {
  this.notifications = this.notifications.filter(notification => {
    return this.selectedMonth ? notification.date.includes(this.selectedMonth) : true;
  });
  this.totalItems = this.notifications.length;
  this.currentPage = 1; // reset to the first page after filtering
}


  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadNotifications();
    }
  }


  getPageNumbers(): (string | number)[] {
    if (this.totalPages <= 0) return [];

    const pages: (string | number)[] = [];
    
    if (this.totalPages <= 7) {
        return Array.from({ length: this.totalPages }, (_, i) => i + 1);
    }

    // Always show first page
    pages.push(1);

    if (this.currentPage > 3) {
        pages.push('...');
    }

    // Show pages around current page
    const start = Math.max(2, this.currentPage - 1);
    const end = Math.min(this.totalPages - 1, this.currentPage + 1);

    for (let i = start; i <= end; i++) {
        pages.push(i);
    }

    if (this.currentPage < this.totalPages - 2) {
        pages.push('...');
    }

    // Always show last page
    if (this.totalPages > 1) {
        pages.push(this.totalPages);
    }

    return pages;
}
openTransactionModal(type: 'deposit' | 'withdrawal' | 'transfer' | 'payement') {
  this.transactionType = type;
  this.transactionModalOpen = true;
}
  handleTransactionConfirm(details: any) {
    console.log('Transaction details:', details);
    // Implémentez ici la logique de traitement de la transaction
  }
  
  loadCompteDetails() {
    this.accountService.getCompteDetails().subscribe(
      (response) => {
        if (response.data) {
          this.compte = response.data;
          this.balance = this.compte?.solde;
          // Vous pouvez aussi stocker le solde maximum si nécessaire
        }
      },
      (error) => {
        console.error('Erreur lors du chargement des détails du compte:', error);
      }
    );
  }


  toggleBalance() {
    this.hideBalance = !this.hideBalance;
  }

  getNotifications(page: number = 1, limit: number = 10) {
    this.notificationService.getUserNotifications(page, limit).subscribe(
      (response) => {
        this.notifications = response.data.notifications;
      },
      (error) => {
        console.error('Error fetching notifications:', error);
      }
    );
  }

  getNotificationIconClass(type: string): string {
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

  getNotificationTitle(notification: Notification): string {
    switch (notification.type) {
      case 'TRANSFERT_RECU':
        return `Reçu de ${notification.compte}`;
      case 'TRANSFERT_ENVOYE':
        return `Envoyé à ${notification.compte}`;
      case 'PAIEMENT':
        return `Paiement à ${notification.compte}`;
      default:
        return 'Notification';
    }
  }

  getAmountClass(notification: Notification): string {
    const baseClasses = 'font-semibold';
    switch (notification.type) {
      case 'TRANSFERT_RECU':
        return `${baseClasses} text-green-500`;
      case 'TRANSFERT_ENVOYE':
      case 'PAIEMENT':
        return `${baseClasses} text-red-500`;
      default:
        return baseClasses;
    }
  }

  getAmountDisplay(notification: Notification): string {
    const prefix = notification.type === 'TRANSFERT_RECU' ? '+' : '-';
    return `${prefix}${notification.montant.toLocaleString()} FCFA`;
  }
  markAsRead(notificationId: string) {
    this.notificationService.markAsRead(notificationId).subscribe(
      (response) => {
        console.log('Notification marked as read');
        // Actualiser les notifications si nécessaire
        this.getNotifications();
      },
      (error) => {
        console.error('Error marking notification as read:', error);
      }
    );
  }
  getTransactionIcon(type: string): string {
    switch (type) {
      case 'TRANSFERT_RECU':
        return 'icon-recieved';
      case 'TRANSFERT_ENVOYE':
        return 'icon-sent';
      case 'PAIEMENT':
        return 'icon-payment';
      default:
        return 'icon-default';
    }
  }
  
  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'Completed':
        return 'badge-completed';
      case 'Pending':
        return 'badge-pending';
      case 'Failed':
        return 'badge-failed';
      default:
        return 'badge-default';
    }
  }
    

  toggleProfileMenu() {
    this.showProfileMenu = !this.showProfileMenu;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const profileMenu = (event.target as HTMLElement).closest('.profile-menu');
    const profileButton = (event.target as HTMLElement).closest('button');
    
    if (!profileMenu && !profileButton && this.showProfileMenu) {
      this.showProfileMenu = false;
    }
  }
  logout(): void {
    this.authService.logout();
  }

  openDeplafonnementModal() {
    this.deplafonnementModalOpen = true;
  }
  
  // Gestionnaire pour la soumission
  handleDeplafonnementSubmit(formData: FormData) {
    this.deplafonnementService.requestDeplafonnement(formData).subscribe({
      next: (response) => {
        console.log('Demande envoyée avec succès:', response);
        this.deplafonnementModalOpen = false;
        // Ajouter ici la logique pour afficher un message de succès
      },
      error: (error) => {
        console.error('Erreur lors de l\'envoi de la demande:', error);
        // Ajouter ici la logique pour afficher un message d'erreur
      }
    });
  }

  
  openDemandeModal() {
    this.demandeModalOpen = true;
  }

  closeDemandeModal() {
    this.demandeModalOpen = false;
  }
}
