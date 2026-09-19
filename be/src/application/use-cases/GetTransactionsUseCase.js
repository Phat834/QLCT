export class GetTransactionsUseCase {
    transactionRepo;
    constructor(transactionRepo) {
        this.transactionRepo = transactionRepo;
    }
    async execute() {
        return await this.transactionRepo.findAll();
    }
}
//# sourceMappingURL=GetTransactionsUseCase.js.map