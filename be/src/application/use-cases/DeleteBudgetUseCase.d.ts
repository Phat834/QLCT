import { IBudgetRepository } from '../../domain/repositories/IBudgetRepository.js';
export declare class DeleteBudgetUseCase {
    private budgetRepo;
    constructor(budgetRepo: IBudgetRepository);
    execute(id: string): Promise<void>;
}
//# sourceMappingURL=DeleteBudgetUseCase.d.ts.map