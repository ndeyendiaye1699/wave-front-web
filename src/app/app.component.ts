import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NotificationListComponent } from '../app/components/notification-list/notification-list.component';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { LoginRegisterComponent } from '../app/components/login-register/login-register.component'
import { AppRoutingModule } from '../app/app-routing/app-routing.module';
import {  AccountLimitComponent } from '../app/components/account-limit/account-limit.component';
import {BalanceCardComponent } from '../app/components/balance-card/balance-card.component';
import {TransactionHistoryComponent} from '../app/components/transaction-history/transaction-history.component';
import { RouterModule } from '@angular/router';
import {WaveCompteComponent } from './wave-compte-component/wave-compte-component'
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NotificationListComponent, HttpClientModule,WaveCompteComponent,CommonModule,LoginRegisterComponent,RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'notification';
}
