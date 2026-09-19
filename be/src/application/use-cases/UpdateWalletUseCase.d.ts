import { IWalletRepository } from '../../domain/repositories/IWalletRepository.js';
import { Wallet } from '../../domain/entities/Wallet.js';
import { WalletType } from '../../domain/enums/WalletType.js';
export interface UpdateWalletDTO {
    id: string;
    name: string;
    balance: number;
    type: WalletType;
}
export declare class UpdateWalletUseCase {
    private walletRepo;
    constructor(walletRepo: IWalletRepository);
    execute(dto: UpdateWalletDTO): Promise<Wallet>;
}
//# sourceMappingURL=UpdateWalletUseCase.d.ts.map