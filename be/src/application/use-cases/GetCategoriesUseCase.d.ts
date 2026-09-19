import { ICategoryRepository } from '../../domain/repositories/ICategoryRepository.js';
export declare class GetCategoriesUseCase {
    private categoryRepo;
    constructor(categoryRepo: ICategoryRepository);
    execute(): Promise<import("../../domain/entities/Category.js").Category[]>;
}
//# sourceMappingURL=GetCategoriesUseCase.d.ts.map