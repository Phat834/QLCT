import { IBudgetRepository } from '../../domain/repositories/IBudgetRepository.js';

export class ReorderBudgetsUseCase {
  constructor(private budgetRepo: IBudgetRepository) {}

  async execute(items: { id: string; sortOrder: number }[]): Promise<void> {
    await this.budgetRepo.updateSortOrder(items);
  }
}