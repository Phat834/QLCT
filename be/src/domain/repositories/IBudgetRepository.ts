import { Budget } from '../entities/Budget.js';

export interface IBudgetRepository {
  save(budget: Budget): Promise<void>;
  findById(id: string): Promise<Budget | null>;
  findByCategoryId(categoryId: string): Promise<Budget | null>;
  findAll(): Promise<Budget[]>;
  delete(id: string): Promise<void>;
}
