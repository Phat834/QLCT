import { IWalletRepository } from '../../domain/repositories/IWalletRepository.js';
export declare class GetWalletsUseCase {
    private walletRepo;
    constructor(walletRepo: IWalletRepository);
    execute(): Promise<import("../../domain/entities/Wallet.js").Wallet[]>;
}
//# sourceMappingURL=GetWalletsUseCase.d.ts.map