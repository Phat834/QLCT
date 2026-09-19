import { Category } from '../../domain/entities/Category.js';
import { ICategoryRepository } from '../../domain/repositories/ICategoryRepository.js';
export declare class SupabaseCategoryRepository implements ICategoryRepository {
    save(category: Category): Promise<void>;
    findById(id: string): Promise<Category | null>;
    findAll(): Promise<Category[]>;
    update(category: Category): Promise<void>;
    delete(id: string): Promise<void>;
}
//# sourceMappingURL=SupabaseCategoryRepository.d.ts.map