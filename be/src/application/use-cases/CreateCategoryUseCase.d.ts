import { ICategoryRepository } from '../../domain/repositories/ICategoryRepository.js';
import { Category } from '../../domain/entities/Category.js';
export interface CreateCategoryDTO {
    id: string;
    name: string;
    icon: string;
}
export declare class CreateCategoryUseCase {
    private categoryRepo;
    constructor(categoryRepo: ICategoryRepository);
    execute(dto: CreateCategoryDTO): Promise<Category>;
}
//# sourceMappingURL=CreateCategoryUseCase.d.ts.map