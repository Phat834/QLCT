import { Transaction } from '../entities/Transaction.js';
export interface ITransactionRepository {
    save(transaction: Transaction): Promise<void>;
    findByWalletId(walletId: string): Promise<Transaction[]>;
    findAll(): Promise<Transaction[]>;
}
//# sourceMappingURL=ITransactionRepository.d.ts.map