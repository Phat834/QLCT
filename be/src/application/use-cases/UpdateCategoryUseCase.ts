import { ICategoryRepository } from '../../domain/repositories/ICategoryRepository.js';
import { Category } from '../../domain/entities/Category.js';

export interface UpdateCategoryDTO {
  id: string;
  name: string;
  icon: string;
}

export class UpdateCategoryUseCase {
  constructor(private categoryRepo: ICategoryRepository) {}

  async execute(dto: UpdateCategoryDTO): Promise<Category> {
    const existing = await this.categoryRepo.findById(dto.id);
    if (!existing) throw new Error('Không tìm thấy danh mục!');

    const category = new Category(dto.id, dto.name, dto.icon);
    await this.categoryRepo.update(category);
    return category;
  }
}
