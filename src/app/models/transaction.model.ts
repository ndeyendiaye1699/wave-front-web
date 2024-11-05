
  export interface Transaction {
    id: string;
    type: 'TRANSFERT_RECU' | 'TRANSFERT_ENVOYE' | 'PAIEMENT';
    sender?: string;
    receiver?: string;
    amount: number;
    newBalance: number;
    date: string;
    status: 'Completed' | 'Pending' | 'Failed';
  }
