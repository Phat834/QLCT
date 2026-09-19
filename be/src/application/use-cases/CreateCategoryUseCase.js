import { Category } from '../../domain/entities/Category.js';
export class CreateCategoryUseCase {
    categoryRepo;
    constructor(categoryRepo) {
        this.categoryRepo = categoryRepo;
    }
    async execute(dto) {
        const category = new Category(dto.id, dto.name, dto.icon);
        await this.categoryRepo.save(category);
        return category;
    }
}
//# sourceMappingURL=CreateCategoryUseCase.js.map