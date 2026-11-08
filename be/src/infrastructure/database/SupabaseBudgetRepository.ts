import { supabase } from './supabaseClient.js';
import { Budget } from '../../domain/entities/Budget.js';
import { IBudgetRepository } from '../../domain/repositories/IBudgetRepository.js';

function parseBudgetWalletIds(item: any): string[] {
  if (Array.isArray(item?.wallet_ids)) return item.wallet_ids.filter((v: any) => v != null).map(String);
  // Tương thích DB cũ dùng wallet_id (đơn) thay vì wallet_ids (mảng)
  if (item?.wallet_id != null && item.wallet_id !== '') return [String(item.wallet_id)];
  return [];
}

function toBudget(item: any): Budget | null {
  try {
    if (!item || item.id == null) return null;
    const categoryId = item.category_id != null ? String(item.category_id) : '';
    return new Budget(
      categoryId,
      parseBudgetWalletIds(item),
      Number(item.limit_amount ?? 0),
      Number(item.current_spent ?? 0),
      String(item.id),
      item.due_date ?? null,
      item.created_at ?? new Date().toISOString(),
      Number(item.sort_order ?? 0)
    );
  } catch (err) {
    console.error('[SupabaseBudgetRepository] Lỗi map budget:', err, item);
    return null;
  }
}

export class SupabaseBudgetRepository implements IBudgetRepository {
  async save(budget: Budget): Promise<void> {
    const { error } = await supabase
      .from('budgets')
      .upsert({
        id: budget.getId(),
        category_id: budget.getCategoryId(),
        wallet_ids: budget.getWalletIds(),
        limit_amount: budget.getLimitAmount(),
        current_spent: budget.getCurrentSpent(),
        due_date: budget.getDueDate(),
        created_at: budget.getCreatedAt(),
        sort_order: budget.getSortOrder(),
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

    if (error || !data) {
      if (error) console.error('[SupabaseBudgetRepository] findById error:', error.message, { id });
      return null;
    }
    return toBudget(data);
  }

  async findByCategoryId(categoryId: string): Promise<Budget | null> {
    const { data, error } = await supabase
      .from('budgets')
      .select('*')
      .eq('category_id', categoryId)
      .single();

    if (error || !data) {
      if (error) console.error('[SupabaseBudgetRepository] findByCategoryId error:', error.message, { categoryId });
      return null;
    }
    return toBudget(data);
  }

  async findAll(): Promise<Budget[]> {
    try {
      let { data, error } = await supabase
        .from('budgets')
        .select('*')
        .order('sort_order', { ascending: true, nullsFirst: false });

      // Fallback nếu cột sort_order chưa tồn tại trong DB
      if (error) {
        console.warn('[SupabaseBudgetRepository] findAll ordered query failed, fallback select *:', error.message);
        const fallback = await supabase.from('budgets').select('*');
        data = fallback.data;
        error = fallback.error;
      }

      if (error) {
        console.error('[SupabaseBudgetRepository] findAll error:', error.message, error.details, error.hint);
        return [];
      }

      if (!Array.isArray(data) || data.length === 0) return [];

      return data
        .map((item) => toBudget(item))
        .filter((b): b is Budget => b !== null);
    } catch (err) {
      console.error('[SupabaseBudgetRepository] findAll unexpected error:', err);
      return [];
    }
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

  async updateSortOrder(items: { id: string; sortOrder: number }[]): Promise<void> {
    const updates = items.map(({ id, sortOrder }) =>
      supabase.from('budgets').update({ sort_order: sortOrder }).eq('id', id)
    );
    const results = await Promise.all(updates);
    const errors = results.filter((r) => r.error);
    if (errors.length > 0) {
      throw new Error(`Lỗi khi cập nhật thứ tự: ${errors.map((e) => e.error?.message).join(', ')}`);
    }
  }
}
