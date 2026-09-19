import { ICategoryRepository } from '../../domain/repositories/ICategoryRepository.js';
import { Category } from '../../domain/entities/Category.js';
export interface UpdateCategoryDTO {
    id: string;
    name: string;
    icon: string;
}
export declare class UpdateCategoryUseCase {
    private categoryRepo;
    constructor(categoryRepo: ICategoryRepository);
    execute(dto: UpdateCategoryDTO): Promise<Category>;
}
//# sourceMappingURL=UpdateCategoryUseCase.d.ts.map