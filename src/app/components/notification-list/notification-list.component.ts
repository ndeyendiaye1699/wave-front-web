import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../services/notification.service';

@Component({
  standalone: true,
  selector: 'app-notification-list',
  template: `
    <div class="notification-list">
      <h2>Notifications</h2>

      <ul class="notifications">
        <li *ngFor="let notification of notifications" 
            class="notification-item">
          <div class="notification-content">
            <p class="message">{{ notification.message }}</p>
            <div class="metadata">
              <span class="type">Type: {{ notification.type }}</span>
              <span class="date">{{ notification.date | date: 'short' }}</span>
            </div>
          </div>
        </li>
      </ul>

      <div class="pagination">
        <button (click)="goToPage(currentPage - 1)" 
                [disabled]="currentPage === 1">
          Précédent
        </button>
        <span>Page {{ currentPage }} sur {{ totalPages }}</span>
        <button (click)="goToPage(currentPage + 1)" 
                [disabled]="currentPage === totalPages">
          Suivant
        </button>
      </div>
    </div>
  `,
  styles: [`
    .notification-list {
      padding: 20px;
      max-width: 800px;
      margin: 0 auto;
    }

    .notifications {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .notification-item {
      padding: 15px;
      border: 1px solid #e0e0e0;
      margin-bottom: 10px;
      border-radius: 8px;
      background-color: white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    }

    .notification-content {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .message {
      margin: 0;
      font-size: 1rem;
      color: #333;
    }

    .metadata {
      display: flex;
      gap: 15px;
      font-size: 0.875rem;
      color: #666;
    }

    .pagination {
      margin-top: 20px;
      display: flex;
      gap: 15px;
      align-items: center;
      justify-content: center;
    }

    button {
      padding: 8px 16px;
      border: 1px solid #ddd;
      background-color: white;
      border-radius: 4px;
      cursor: pointer;
    }

    button:disabled {
      background-color: #f5f5f5;
      cursor: not-allowed;
    }

    button:hover:not(:disabled) {
      background-color: #f5f5f5;
    }
  `],
  imports: [CommonModule]
})
export class NotificationListComponent implements OnInit {
  notifications: any[] = [];
  currentPage: number = 1;
  totalPages: number = 1;
  itemsPerPage: number = 10;

  constructor(private notificationService: NotificationService) {
    // S'abonner aux notifications en temps réel
    this.notificationService.notifications$.subscribe(notifications => {
      console.log("Nouvelles notifications:", notifications);
      if (this.currentPage === 1) {
        this.notifications = notifications;
      }
    });
    
  }

  ngOnInit(): void {
    this.loadNotifications();
  }

  loadNotifications(page: number = 1): void {
    this.notificationService.getAllNotifications(page, this.itemsPerPage).subscribe({
      next: (response) => {
        this.notifications = response.data.notifications;
        this.currentPage = response.data.pagination.currentPage;
        this.totalPages = response.data.pagination.totalPages;
        
        // Mettre à jour le BehaviorSubject si on est sur la première page
        if (page === 1) {
          this.notificationService.updateNotifications(this.notifications);
        }
      },
      error: (error) => console.error('Erreur lors du chargement des notifications:', error)
    });
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.loadNotifications(page);
    }
  }
}
