import { IBudgetRepository } from '../../domain/repositories/IBudgetRepository.js';
import { Budget } from '../../domain/entities/Budget.js';

export interface UpdateBudgetDTO {
  id: string;
  categoryId: string;
  limitAmount: number;
}

export class UpdateBudgetUseCase {
  constructor(private budgetRepo: IBudgetRepository) {}

  async execute(dto: UpdateBudgetDTO): Promise<Budget> {
    const existing = await this.budgetRepo.findById(dto.id);
    if (!existing) throw new Error('Không tìm thấy ngân sách!');

    const budget = new Budget(dto.categoryId, dto.limitAmount, existing.getCurrentSpent(), dto.id);
    await this.budgetRepo.save(budget);
    return budget;
  }
}
