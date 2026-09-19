import { Transaction } from '../../domain/entities/Transaction.js';
import { ITransactionRepository } from '../../domain/repositories/ITransactionRepository.js';
export declare class SupabaseTransactionRepository implements ITransactionRepository {
    save(transaction: Transaction): Promise<void>;
    findById(id: string): Promise<Transaction | null>;
    findByWalletId(walletId: string): Promise<Transaction[]>;
    findAll(): Promise<Transaction[]>;
}
//# sourceMappingURL=SupabaseTransactionRepository.d.ts.map