// Fichier: components/top-navigation.component.ts
import { Component, Input,Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-top-navigation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './top-navigation.component.component.html'
   
})
export class TopNavigationComponent {
  @Input() showProfileMenu = false;
  @Output() toggleProfileMenu = new EventEmitter<void>();
}
