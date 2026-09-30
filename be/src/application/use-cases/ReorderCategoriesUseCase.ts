import { ICategoryRepository } from '../../domain/repositories/ICategoryRepository.js';

export class ReorderCategoriesUseCase {
  constructor(private categoryRepo: ICategoryRepository) {}

  async execute(items: { id: string; sortOrder: number }[]): Promise<void> {
    await this.categoryRepo.updateSortOrder(items);
  }
}