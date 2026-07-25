export interface Wallet {
  id: string;
  name: string;
  balance: number;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}

export interface Transaction {
  id: string;
  walletId: string;
  categoryId?: string;
  amount: number;
  type: 'INCOME' | 'EXPENSE' | 'TRANSFER';
  targetWalletId?: string;
  createdAt: string;
}

export interface Budget {
  id: string;
  categoryId: string;
  limitAmount: number;
  currentSpent: number;
}