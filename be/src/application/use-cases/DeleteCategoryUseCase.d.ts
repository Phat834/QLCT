import { ICategoryRepository } from '../../domain/repositories/ICategoryRepository.js';
export declare class DeleteCategoryUseCase {
    private categoryRepo;
    constructor(categoryRepo: ICategoryRepository);
    execute(id: string): Promise<void>;
}
//# sourceMappingURL=DeleteCategoryUseCase.d.ts.map