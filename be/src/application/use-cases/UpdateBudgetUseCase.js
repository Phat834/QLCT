import { Budget } from '../../domain/entities/Budget.js';
export class UpdateBudgetUseCase {
    budgetRepo;
    constructor(budgetRepo) {
        this.budgetRepo = budgetRepo;
    }
    async execute(dto) {
        const existing = await this.budgetRepo.findById(dto.id);
        if (!existing)
            throw new Error('Không tìm thấy ngân sách!');
        const walletIds = dto.walletIds || existing.getWalletIds();
        const dueDate = dto.dueDate !== undefined ? dto.dueDate : existing.getDueDate();
        const budget = new Budget(dto.categoryId, walletIds, dto.limitAmount, existing.getCurrentSpent(), dto.id, dueDate, existing.getCreatedAt());
        await this.budgetRepo.save(budget);
        return budget;
    }
}
//# sourceMappingURL=UpdateBudgetUseCase.js.map