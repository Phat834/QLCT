import { Category } from '../../domain/entities/Category.js';
export class UpdateCategoryUseCase {
    categoryRepo;
    constructor(categoryRepo) {
        this.categoryRepo = categoryRepo;
    }
    async execute(dto) {
        const existing = await this.categoryRepo.findById(dto.id);
        if (!existing)
            throw new Error('Không tìm thấy danh mục!');
        const category = new Category(dto.id, dto.name, dto.icon);
        await this.categoryRepo.update(category);
        return category;
    }
}
//# sourceMappingURL=UpdateCategoryUseCase.js.map