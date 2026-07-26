import { supabase } from './supabaseClient.js';
import { Budget } from '../../domain/entities/Budget.js';
import { IBudgetRepository } from '../../domain/repositories/IBudgetRepository.js';

export class SupabaseBudgetRepository implements IBudgetRepository {
  async save(budget: Budget): Promise<void> {
    const { error } = await supabase
      .from('budgets')
      .upsert({
        id: budget.getId(),
        category_id: budget.getCategoryId(),
        limit_amount: budget.getLimitAmount(),
        current_spent: budget.getCurrentSpent(),
      });

    if (error) {
      throw new Error(`Lỗi khi lưu Budget: ${error.message}`);
    }
  }

  async findById(id: string): Promise<Budget | null> {
    const { data, error } = await supabase
      .from('budgets')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) return null;

    return new Budget(data.category_id, Number(data.limit_amount), Number(data.current_spent), data.id);
  }

  async findByCategoryId(categoryId: string): Promise<Budget | null> {
    const { data, error } = await supabase
      .from('budgets')
      .select('*')
      .eq('category_id', categoryId)
      .single();

    if (error || !data) return null;

    return new Budget(data.category_id, Number(data.limit_amount), Number(data.current_spent), data.id);
  }

  async findAll(): Promise<Budget[]> {
    const { data, error } = await supabase.from('budgets').select('*');

    if (error) {
      throw new Error(`Lỗi khi lấy danh sách Budget: ${error.message}`);
    }

    return data.map(
      (item) => new Budget(item.category_id, Number(item.limit_amount), Number(item.current_spent), item.id)
    );
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('budgets')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Lỗi khi xoá Budget: ${error.message}`);
    }
  }
}
