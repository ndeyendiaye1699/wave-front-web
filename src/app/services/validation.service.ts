import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {
  // Valide que le champ est requis
  static required(control: AbstractControl): ValidationErrors | null {
    return control.value ? null : { required: true };
  }

  // Valide la longueur minimale du mot de passe
  static minLength(min: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      return control.value && control.value.length >= min ? null : { minLength: { requiredLength: min } };
    };
  }

  // Valide la correspondance entre le mot de passe et la confirmation
  static passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    if (control instanceof FormGroup) {
      const password = control.get('password')?.value;
      const confirmPassword = control.get('confirmPassword')?.value;
      return password === confirmPassword ? null : { passwordMismatch: true };
    }
    return null;
  };
}
