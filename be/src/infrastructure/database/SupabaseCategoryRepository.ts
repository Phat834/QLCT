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

    return new Category(data.id, data.name, data.icon, data.created_at);
  }

  async findAll(): Promise<Category[]> {
    const { data, error } = await supabase.from('categories').select('*').order('id', { ascending: true });

    if (error || !data) return [];

    return data.map((item) => new Category(item.id, item.name, item.icon, item.created_at));
  }

  async update(category: Category): Promise<void> {
    const { error } = await supabase
      .from('categories')
      .upsert({
        id: category.getId(),
        name: category.getName(),
        icon: category.getIcon(),
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
}