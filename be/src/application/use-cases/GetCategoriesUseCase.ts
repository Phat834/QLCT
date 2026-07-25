import { ICategoryRepository } from '../../domain/repositories/ICategoryRepository.js';

export class GetCategoriesUseCase {
  constructor(private categoryRepo: ICategoryRepository) {}

  async execute() {
    return await this.categoryRepo.findAll();
  }
}