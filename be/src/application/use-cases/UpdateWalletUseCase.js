import { Wallet } from '../../domain/entities/Wallet.js';
export class UpdateWalletUseCase {
    walletRepo;
    constructor(walletRepo) {
        this.walletRepo = walletRepo;
    }
    async execute(dto) {
        const existing = await this.walletRepo.findById(dto.id);
        if (!existing)
            throw new Error('Không tìm thấy ví!');
        const wallet = new Wallet(dto.id, dto.name, dto.balance, existing.getCreatedAt(), dto.type);
        await this.walletRepo.update(wallet);
        return wallet;
    }
}
//# sourceMappingURL=UpdateWalletUseCase.js.map