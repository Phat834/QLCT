import { IBudgetRepository } from '../../domain/repositories/IBudgetRepository.js';

export interface GetBudgetByCategoryDTO {
  categoryId: string;
}

export class GetBudgetByCategoryUseCase {
  constructor(private budgetRepo: IBudgetRepository) {}

  async execute(dto: GetBudgetByCategoryDTO) {
    return await this.budgetRepo.findByCategoryId(dto.categoryId);
  }
}
