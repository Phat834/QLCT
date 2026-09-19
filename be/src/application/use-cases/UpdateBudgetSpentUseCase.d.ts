import { IBudgetRepository } from '../../domain/repositories/IBudgetRepository.js';
import { ITransactionRepository } from '../../domain/repositories/ITransactionRepository.js';
import { TransactionType } from '../../domain/enums/TransactionType.js';
export interface UpdateBudgetSpentDTO {
    categoryId: string;
    amount: number;
    type: TransactionType;
}
export declare class UpdateBudgetSpentUseCase {
    private budgetRepo;
    private transactionRepo;
    constructor(budgetRepo: IBudgetRepository, transactionRepo: ITransactionRepository);
    execute(dto: UpdateBudgetSpentDTO): Promise<void>;
}
//# sourceMappingURL=UpdateBudgetSpentUseCase.d.ts.map