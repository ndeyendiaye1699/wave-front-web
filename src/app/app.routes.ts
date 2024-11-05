import { AccueilComponent } from './components/accueil/accueil.component';
import { Routes } from '@angular/router';
import { LoginRegisterComponent } from '../app/components/login-register/login-register.component';
import {WaveCompteComponent } from './wave-compte-component/wave-compte-component'
import { AuthGuard } from './guards/auth.guard';
export const routes: Routes = [
    { path: 'accueil', component: AccueilComponent },
    { path: 'login', component: LoginRegisterComponent },
    { path: 'register', component: LoginRegisterComponent },  // Added route for registration
    { 
      path: 'home', 
      component: WaveCompteComponent,
      canActivate: [AuthGuard]
    },
    { path: '', redirectTo: '/accueil', pathMatch: 'full' }
  ];
  