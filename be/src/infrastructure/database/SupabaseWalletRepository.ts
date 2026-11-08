import { supabase } from './supabaseClient.js';
import { Wallet } from '../../domain/entities/Wallet.js';
import { WalletType } from '../../domain/enums/WalletType.js';
import { IWalletRepository } from '../../domain/repositories/IWalletRepository.js';

function toWallet(item: any): Wallet | null {
  try {
    if (!item || item.id == null) return null;
    const type = item.type === WalletType.SAVINGS ? WalletType.SAVINGS : WalletType.AVAILABLE;
    return new Wallet(
      String(item.id),
      item.name ?? '',
      Number(item.balance ?? 0),
      item.created_at ? new Date(item.created_at) : undefined,
      type,
      Number(item.sort_order ?? 0)
    );
  } catch (err) {
    console.error('[SupabaseWalletRepository] Lỗi map wallet:', err, item);
    return null;
  }
}

export class SupabaseWalletRepository implements IWalletRepository {
  async save(wallet: Wallet): Promise<void> {
    const { error } = await supabase
      .from('wallets')
      .upsert({
        id: wallet.getId(),
        name: wallet.getName(),
        balance: wallet.getBalance(),
        created_at: wallet.getCreatedAt().toISOString(),
        type: wallet.getType(),
        sort_order: wallet.getSortOrder(),
      });

    if (error) {
      throw new Error(`Lỗi khi lưu Wallet: ${error.message}`);
    }
  }

  async update(wallet: Wallet): Promise<void> {
    await this.save(wallet);
  }

  async findById(id: string): Promise<Wallet | null> {
    const { data, error } = await supabase
      .from('wallets')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      if (error) console.error('[SupabaseWalletRepository] findById error:', error.message, { id });
      return null;
    }

    return toWallet(data);
  }

  async findAll(): Promise<Wallet[]> {
    try {
      let { data, error } = await supabase
        .from('wallets')
        .select('*')
        .order('sort_order', { ascending: true, nullsFirst: false });

      // Fallback nếu cột sort_order chưa tồn tại trong DB
      if (error) {
        console.warn('[SupabaseWalletRepository] findAll ordered query failed, fallback select *:', error.message);
        const fallback = await supabase.from('wallets').select('*');
        data = fallback.data;
        error = fallback.error;
      }

      if (error) {
        console.error('[SupabaseWalletRepository] findAll error:', error.message, error.details, error.hint);
        return [];
      }

      if (!Array.isArray(data) || data.length === 0) return [];

      return data
        .map((item) => toWallet(item))
        .filter((w): w is Wallet => w !== null);
    } catch (err) {
      console.error('[SupabaseWalletRepository] findAll unexpected error:', err);
      return [];
    }
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('wallets')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Lỗi khi xoá Wallet: ${error.message}`);
    }
  }

  async updateSortOrder(items: { id: string; sortOrder: number }[]): Promise<void> {
    const updates = items.map(({ id, sortOrder }) =>
      supabase.from('wallets').update({ sort_order: sortOrder }).eq('id', id)
    );
    const results = await Promise.all(updates);
    const errors = results.filter((r) => r.error);
    if (errors.length > 0) {
      throw new Error(`Lỗi khi cập nhật thứ tự: ${errors.map((e) => e.error?.message).join(', ')}`);
    }
  }
}