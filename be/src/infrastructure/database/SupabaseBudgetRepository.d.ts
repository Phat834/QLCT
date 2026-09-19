import { Budget } from '../../domain/entities/Budget.js';
import { IBudgetRepository } from '../../domain/repositories/IBudgetRepository.js';
export declare class SupabaseBudgetRepository implements IBudgetRepository {
    save(budget: Budget): Promise<void>;
    findById(id: string): Promise<Budget | null>;
    findByCategoryId(categoryId: string): Promise<Budget | null>;
    findAll(): Promise<Budget[]>;
    delete(id: string): Promise<void>;
}
//# sourceMappingURL=SupabaseBudgetRepository.d.ts.map