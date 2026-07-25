import { IBudgetRepository } from '../../domain/repositories/IBudgetRepository.js';
import { ITransactionRepository } from '../../domain/repositories/ITransactionRepository.js';
import { TransactionType } from '../../domain/enums/TransactionType.js';

export interface UpdateBudgetSpentDTO {
  categoryId: string;
  amount: number;
  type: TransactionType;
}

export class UpdateBudgetSpentUseCase {
  constructor(
    private budgetRepo: IBudgetRepository,
    private transactionRepo: ITransactionRepository
  ) {}

  async execute(dto: UpdateBudgetSpentDTO): Promise<void> {
    const budget = await this.budgetRepo.findByCategoryId(dto.categoryId);
    if (!budget) return;

    if (dto.type === TransactionType.EXPENSE) {
      budget.addExpense(dto.amount);
    }

    await this.budgetRepo.save(budget);
  }
}
