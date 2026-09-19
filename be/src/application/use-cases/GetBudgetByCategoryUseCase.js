export class GetBudgetByCategoryUseCase {
    budgetRepo;
    constructor(budgetRepo) {
        this.budgetRepo = budgetRepo;
    }
    async execute(dto) {
        return await this.budgetRepo.findByCategoryId(dto.categoryId);
    }
}
//# sourceMappingURL=GetBudgetByCategoryUseCase.js.map