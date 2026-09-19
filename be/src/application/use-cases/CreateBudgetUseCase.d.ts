import { IBudgetRepository } from '../../domain/repositories/IBudgetRepository.js';
import { Budget } from '../../domain/entities/Budget.js';
export interface CreateBudgetDTO {
    id: string;
    categoryId: string;
    walletIds: string[];
    limitAmount: number;
    dueDate?: string | null;
}
export declare class CreateBudgetUseCase {
    private budgetRepo;
    constructor(budgetRepo: IBudgetRepository);
    execute(dto: CreateBudgetDTO): Promise<Budget>;
}
//# sourceMappingURL=CreateBudgetUseCase.d.ts.map