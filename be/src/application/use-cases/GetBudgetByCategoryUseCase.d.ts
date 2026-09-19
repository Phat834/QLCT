import { IBudgetRepository } from '../../domain/repositories/IBudgetRepository.js';
export interface GetBudgetByCategoryDTO {
    categoryId: string;
}
export declare class GetBudgetByCategoryUseCase {
    private budgetRepo;
    constructor(budgetRepo: IBudgetRepository);
    execute(dto: GetBudgetByCategoryDTO): Promise<import("../../domain/entities/Budget.js").Budget | null>;
}
//# sourceMappingURL=GetBudgetByCategoryUseCase.d.ts.map