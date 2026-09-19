import { Wallet } from '../../domain/entities/Wallet.js';
export class CreateWalletUseCase {
    walletRepo;
    constructor(walletRepo) {
        this.walletRepo = walletRepo;
    }
    async execute(dto) {
        const wallet = new Wallet(dto.id, dto.name, dto.balance, undefined, dto.type);
        await this.walletRepo.save(wallet);
        return wallet;
    }
}
//# sourceMappingURL=CreateWalletUseCase.js.map