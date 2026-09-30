import { supabase } from './supabaseClient.js';
import { Category } from '../../domain/entities/Category.js';
import { ICategoryRepository } from '../../domain/repositories/ICategoryRepository.js';

export class SupabaseCategoryRepository implements ICategoryRepository {
  async save(category: Category): Promise<void> {
    const { error } = await supabase
      .from('categories')
      .upsert({
        id: category.getId(),
        name: category.getName(),
        icon: category.getIcon(),
        created_at: category.getCreatedAt(),
        sort_order: category.getSortOrder(),
      });

    if (error) {
      throw new Error(`Lỗi khi lưu Category: ${error.message}`);
    }
  }

  async findById(id: string): Promise<Category | null> {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) return null;

    return new Category(data.id, data.name, data.icon, data.created_at, data.sort_order ?? 0);
  }

  async findAll(): Promise<Category[]> {
    const { data, error } = await supabase.from('categories').select('*').order('sort_order', { ascending: true, nullsFirst: false });

    if (error || !data) return [];

    return data.map((item) => new Category(item.id, item.name, item.icon, item.created_at, item.sort_order ?? 0));
  }

  async update(category: Category): Promise<void> {
    const { error } = await supabase
      .from('categories')
      .upsert({
        id: category.getId(),
        name: category.getName(),
        icon: category.getIcon(),
        sort_order: category.getSortOrder(),
      });

    if (error) {
      throw new Error(`Lỗi khi cập nhật Category: ${error.message}`);
    }
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Lỗi khi xoá Category: ${error.message}`);
    }
  }

  async updateSortOrder(items: { id: string; sortOrder: number }[]): Promise<void> {
    const updates = items.map(({ id, sortOrder }) =>
      supabase.from('categories').update({ sort_order: sortOrder }).eq('id', id)
    );
    const results = await Promise.all(updates);
    const errors = results.filter((r) => r.error);
    if (errors.length > 0) {
      throw new Error(`Lỗi khi cập nhật thứ tự: ${errors.map((e) => e.error?.message).join(', ')}`);
    }
  }
}