export class DeleteBudgetUseCase {
    budgetRepo;
    constructor(budgetRepo) {
        this.budgetRepo = budgetRepo;
    }
    async execute(id) {
        await this.budgetRepo.delete(id);
    }
}
//# sourceMappingURL=DeleteBudgetUseCase.js.map