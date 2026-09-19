export class GetBudgetsUseCase {
    budgetRepo;
    constructor(budgetRepo) {
        this.budgetRepo = budgetRepo;
    }
    async execute() {
        return await this.budgetRepo.findAll();
    }
}
//# sourceMappingURL=GetBudgetsUseCase.js.map