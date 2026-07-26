import { supabase } from './supabaseClient.js';
import { Wallet } from '../../domain/entities/Wallet.js';
import { IWalletRepository } from '../../domain/repositories/IWalletRepository.js';

export class SupabaseWalletRepository implements IWalletRepository {
  async save(wallet: Wallet): Promise<void> {
    const { error } = await supabase
      .from('wallets')
      .upsert({
        id: wallet.getId(),
        name: wallet.getName(),
        balance: wallet.getBalance(),
        created_at: wallet.getCreatedAt().toISOString(),
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
      return null;
    }

    return new Wallet(
      data.id,
      data.name,
      Number(data.balance),
      new Date(data.created_at)
    );
  }

  async findAll(): Promise<Wallet[]> {
    const { data, error } = await supabase.from('wallets').select('*');

    if (error) {
      throw new Error(`Lỗi khi lấy danh sách Wallet: ${error.message}`);
    }

    return data.map(
      (item) => new Wallet(item.id, item.name, Number(item.balance), new Date(item.created_at))
    );
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
}