import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccueilComponent } from '../components/accueil/accueil.component';
import { LoginRegisterComponent } from '../components/login-register/login-register.component';
import { WaveCompteComponent } from '../wave-compte-component/wave-compte-component';

const routes: Routes = [
  { path: 'accueil', component: AccueilComponent },
  { path: 'login', component: LoginRegisterComponent },
  { path: 'home', component: WaveCompteComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }