import { Wallet } from '../../domain/entities/Wallet.js';
import { IWalletRepository } from '../../domain/repositories/IWalletRepository.js';
export declare class SupabaseWalletRepository implements IWalletRepository {
    save(wallet: Wallet): Promise<void>;
    update(wallet: Wallet): Promise<void>;
    findById(id: string): Promise<Wallet | null>;
    findAll(): Promise<Wallet[]>;
    delete(id: string): Promise<void>;
}
//# sourceMappingURL=SupabaseWalletRepository.d.ts.map