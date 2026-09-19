import { Budget } from '../../domain/entities/Budget.js';
export class CreateBudgetUseCase {
    budgetRepo;
    constructor(budgetRepo) {
        this.budgetRepo = budgetRepo;
    }
    async execute(dto) {
        const existing = await this.budgetRepo.findByCategoryId(dto.categoryId);
        if (existing) {
            throw new Error('Danh mục này đã có budget!');
        }
        const budget = new Budget(dto.categoryId, dto.walletIds, dto.limitAmount, 0, dto.id, dto.dueDate ?? null);
        await this.budgetRepo.save(budget);
        return budget;
    }
}
//# sourceMappingURL=CreateBudgetUseCase.js.map