import { IBudgetRepository } from '../../domain/repositories/IBudgetRepository.js';

export class GetBudgetsUseCase {
  constructor(private budgetRepo: IBudgetRepository) {}

  async execute() {
    return await this.budgetRepo.findAll();
  }
}
