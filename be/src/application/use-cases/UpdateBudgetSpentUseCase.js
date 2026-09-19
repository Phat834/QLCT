import { TransactionType } from '../../domain/enums/TransactionType.js';
export class UpdateBudgetSpentUseCase {
    budgetRepo;
    transactionRepo;
    constructor(budgetRepo, transactionRepo) {
        this.budgetRepo = budgetRepo;
        this.transactionRepo = transactionRepo;
    }
    async execute(dto) {
        const budget = await this.budgetRepo.findByCategoryId(dto.categoryId);
        if (!budget)
            return;
        if (dto.type === TransactionType.EXPENSE) {
            budget.addExpense(dto.amount);
        }
        await this.budgetRepo.save(budget);
    }
}
//# sourceMappingURL=UpdateBudgetSpentUseCase.js.map