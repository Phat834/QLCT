import { Category } from '../entities/Category.js';
export interface ICategoryRepository {
    save(category: Category): Promise<void>;
    findById(id: string): Promise<Category | null>;
    findAll(): Promise<Category[]>;
    update(category: Category): Promise<void>;
    delete(id: string): Promise<void>;
}
//# sourceMappingURL=ICategoryRepository.d.ts.map