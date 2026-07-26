import { IBudgetRepository } from '../../domain/repositories/IBudgetRepository.js';

export class DeleteBudgetUseCase {
  constructor(private budgetRepo: IBudgetRepository) {}

  async execute(id: string): Promise<void> {
    await this.budgetRepo.delete(id);
  }
}
