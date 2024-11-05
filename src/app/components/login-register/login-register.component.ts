import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ValidationService } from '../../services/validation.service';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
@Component({
  standalone: true,
  selector: 'app-login-register',
  templateUrl: './login-register.component.html',
  styleUrls: ['./login-register.component.css'],
  imports: [ReactiveFormsModule, CommonModule]
})
export class LoginRegisterComponent implements OnInit {
  showRegister = false;
  showLoginPassword = false;
  showRegisterPassword = false;
  imagePreview: string | null = null;
  formSubmitted = false; // Nouvelle variable pour suivre l'état de soumission
  errorMessage = '';
  isLoading = false;
  loginForm: FormGroup;
  registerForm: FormGroup;

  constructor(private fb: FormBuilder

    ,
    private userService: UserService,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      telephone: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    this.registerForm = this.fb.group({
      nom: ['', [Validators.required]],
      prenom: ['', [Validators.required]],
      telephone: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      role: ['', [Validators.required]],
      photo: [null]
    }, {
      validators: ValidationService.passwordMatchValidator
    });
  }

  ngOnInit(): void {}

  onLogin(): void {
    this.formSubmitted = true;
    if (this.loginForm.valid) {
      const credentials = {
        telephone: this.loginForm.get('telephone')?.value,
        password: this.loginForm.get('password')?.value
      };

      this.authService.login(credentials).subscribe({
        next: (response) => {
          console.log('Connexion réussie:', response);
          this.router.navigate(['/home']);
        },
        error: (error) => {
          console.error('Erreur de connexion:', error);
          this.errorMessage = error.error.message || 'Erreur lors de la connexion';
        }
      });
    }
  }

  toggleForm(event: Event): void {
    event.preventDefault();
    this.showRegister = !this.showRegister;
    this.formSubmitted = false; // Réinitialiser l'état de soumission lors du changement de formulaire
  }

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.registerForm.patchValue({ photo: file });

      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  
  onRegister(): void {
    this.formSubmitted = true;
    this.errorMessage = '';
    
    if (this.registerForm.valid) {
      this.isLoading = true;
      
      const userData = {
        nom: this.registerForm.get('nom')?.value,
        prenom: this.registerForm.get('prenom')?.value,
        telephone: this.registerForm.get('telephone')?.value,
        mdp: this.registerForm.get('password')?.value,
        confirmMdp: this.registerForm.get('confirmPassword')?.value,
        role: this.registerForm.get('role')?.value,
        photoProfile: this.registerForm.get('photo')?.value
      };

      this.userService.createUser(userData).subscribe({
        next: (response) => {
          console.log('Utilisateur créé avec succès:', response);
          this.isLoading = false;
          // Réinitialiser le formulaire ou rediriger l'utilisateur
          this.registerForm.reset();
          this.formSubmitted = false;
          this.imagePreview = null;
          // Éventuellement afficher un message de succès ou rediriger
        },
        error: (error) => {
          console.error('Erreur lors de la création:', error);
          this.isLoading = false;
          this.errorMessage = error.error.message || 'Une erreur est survenue lors de la création du compte';
        }
      });
    }
  }


  // Méthodes pour vérifier les erreurs (ne s'affichent que si le formulaire a été soumis)
  shouldShowError(formGroup: FormGroup, controlName: string, errorType: string): boolean {
    const control = formGroup.get(controlName);
    return this.formSubmitted && control?.errors?.[errorType];
  }
}
