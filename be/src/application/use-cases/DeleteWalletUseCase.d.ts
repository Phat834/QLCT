import { IWalletRepository } from '../../domain/repositories/IWalletRepository.js';
export declare class DeleteWalletUseCase {
    private walletRepo;
    constructor(walletRepo: IWalletRepository);
    execute(id: string): Promise<void>;
}
//# sourceMappingURL=DeleteWalletUseCase.d.ts.map