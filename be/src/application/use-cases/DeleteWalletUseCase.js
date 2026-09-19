export class DeleteWalletUseCase {
    walletRepo;
    constructor(walletRepo) {
        this.walletRepo = walletRepo;
    }
    async execute(id) {
        await this.walletRepo.delete(id);
    }
}
//# sourceMappingURL=DeleteWalletUseCase.js.map