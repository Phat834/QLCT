import { IWalletRepository } from '../../domain/repositories/IWalletRepository.js';
import { Wallet } from '../../domain/entities/Wallet.js';
import { WalletType } from '../../domain/enums/WalletType.js';
export interface CreateWalletDTO {
    id: string;
    name: string;
    balance: number;
    type: WalletType;
}
export declare class CreateWalletUseCase {
    private walletRepo;
    constructor(walletRepo: IWalletRepository);
    execute(dto: CreateWalletDTO): Promise<Wallet>;
}
//# sourceMappingURL=CreateWalletUseCase.d.ts.map