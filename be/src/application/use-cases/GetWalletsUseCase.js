export class GetWalletsUseCase {
    walletRepo;
    constructor(walletRepo) {
        this.walletRepo = walletRepo;
    }
    async execute() {
        return await this.walletRepo.findAll();
    }
}
//# sourceMappingURL=GetWalletsUseCase.js.map