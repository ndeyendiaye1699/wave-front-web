export interface DeplafonnementRequest {
    _id: string;
    utilisateur: string;
    photoPiece1: string;
    photoPiece2: string | null;
    status: 'EN_COURS' | 'VALIDÉ' | 'REJETÉ';
    nomUtilisateur: string;
    prenomUtilisateur: string;
    photoProfile: string;
    roleUtilisateur: string;
    createdAt: Date;
  }
  
  export interface ValidateDeplafonnementDto {
    soldeMaximum: number;
    cummulTransactionMensuelle: number;
  }
  