import { IBudgetRepository } from '../../domain/repositories/IBudgetRepository.js';
import { Budget } from '../../domain/entities/Budget.js';

export interface CreateBudgetDTO {
  id: string;
  categoryId: string;
  walletId: string;
  limitAmount: number;
}

export class CreateBudgetUseCase {
  constructor(private budgetRepo: IBudgetRepository) {}

  async execute(dto: CreateBudgetDTO): Promise<Budget> {
    const existing = await this.budgetRepo.findByCategoryId(dto.categoryId);
    if (existing) {
      throw new Error('Danh mục này đã có budget!');
    }

    const budget = new Budget(dto.categoryId, dto.walletId, dto.limitAmount, 0, dto.id);
    await this.budgetRepo.save(budget);
    return budget;
  }
}
