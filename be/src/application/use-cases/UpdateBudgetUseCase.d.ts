import { IBudgetRepository } from '../../domain/repositories/IBudgetRepository.js';
import { Budget } from '../../domain/entities/Budget.js';
export interface UpdateBudgetDTO {
    id: string;
    categoryId: string;
    walletIds?: string[];
    limitAmount: number;
    dueDate?: string | null;
}
export declare class UpdateBudgetUseCase {
    private budgetRepo;
    constructor(budgetRepo: IBudgetRepository);
    execute(dto: UpdateBudgetDTO): Promise<Budget>;
}
//# sourceMappingURL=UpdateBudgetUseCase.d.ts.map