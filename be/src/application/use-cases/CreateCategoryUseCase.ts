import { ICategoryRepository } from '../../domain/repositories/ICategoryRepository.js';
import { Category } from '../../domain/entities/Category.js';

export interface CreateCategoryDTO {
  id: string;
  name: string;
  icon: string;
}

export class CreateCategoryUseCase {
  constructor(private categoryRepo: ICategoryRepository) {}

  async execute(dto: CreateCategoryDTO): Promise<Category> {
    const category = new Category(dto.id, dto.name, dto.icon);
    await this.categoryRepo.save(category);
    return category;
  }
}
