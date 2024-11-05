// src/app/qr-code/qr-code.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import * as QRCode from 'qrcode';

@Component({
  selector: 'app-qr-code',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './qr-code.component.html',
  styleUrls: ['./qr-code.component.css']
})
export class QrCodeComponent implements OnInit {
  qrCodeDataUrl: string = '';
  userInfo: any = null;
  isLoading: boolean = true;
  error: string | null = null;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    try {
      this.userInfo = this.authService.getConnectedUser();
      if (this.userInfo) {
        this.generateQRCode();
      } else {
        this.error = "Aucun utilisateur connecté";
      }
    } catch (err) {
      this.error = "Erreur lors de la récupération des données utilisateur";
      console.error(err);
    }
    this.isLoading = false;
  }

  private async generateQRCode() {
    const userDataString = JSON.stringify({
      nom: this.userInfo.nom,
      prenom: this.userInfo.prenom,
      telephone: this.userInfo.telephone
    });

    try {
      this.qrCodeDataUrl = await QRCode.toDataURL(userDataString, {
        width: 160,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#ffffff'
        }
      });
    } catch (err) {
      this.error = "Erreur lors de la génération du QR code";
      console.error(err);
    }
  }

  // private async generateQRCode() {
  //   // Manually create the string without JSON format
  //   const userDataString = `nom: ${this.userInfo.nom}, prenom: ${this.userInfo.prenom}, telephone: ${this.userInfo.telephone}`;
  
  //   try {
  //     this.qrCodeDataUrl = await QRCode.toDataURL(userDataString, {
  //       width: 160,
  //       margin: 2,
  //       color: {
  //         dark: '#000000',
  //         light: '#ffffff'
  //       }
  //     });
  //   } catch (err) {
  //     this.error = "Erreur lors de la génération du QR code";
  //     console.error(err);
  //   }
  // }
  
  // Fonction pour télécharger le QR code
  downloadQRCode() {
    if (this.qrCodeDataUrl) {
      const link = document.createElement('a');
      link.download = `qrcode-${this.userInfo.nom}-${this.userInfo.prenom}.png`;
      link.href = this.qrCodeDataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
}