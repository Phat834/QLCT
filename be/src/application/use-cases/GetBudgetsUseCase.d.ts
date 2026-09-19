import { IBudgetRepository } from '../../domain/repositories/IBudgetRepository.js';
export declare class GetBudgetsUseCase {
    private budgetRepo;
    constructor(budgetRepo: IBudgetRepository);
    execute(): Promise<import("../../domain/entities/Budget.js").Budget[]>;
}
//# sourceMappingURL=GetBudgetsUseCase.d.ts.map