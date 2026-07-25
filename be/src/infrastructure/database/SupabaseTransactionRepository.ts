import { supabase } from './supabaseClient.js';
import { Transaction } from '../../domain/entities/Transaction.js';
import { ITransactionRepository } from '../../domain/repositories/ITransactionRepository.js';

export class SupabaseTransactionRepository implements ITransactionRepository {
  async save(transaction: Transaction): Promise<void> {
    const { error } = await supabase
      .from('transactions')
      .upsert({
        id: transaction.getId(),
        wallet_id: transaction.getWalletId(),
        category_id: transaction.getCategoryId(),
        target_wallet_id: transaction.getTargetWalletId() || null,
        amount: transaction.getAmount(),
        type: transaction.getType(),
        created_at: transaction.getCreatedAt(),
      });

    if (error) {
      throw new Error(`Lỗi khi lưu Transaction: ${error.message}`);
    }
  }

  async findById(id: string): Promise<Transaction | null> {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) return null;

    // Thứ tự tham số chuẩn: id, walletId, categoryId, targetWalletId, amount, type, createdAt
    return new Transaction(
      data.id,
      data.wallet_id,
      Number(data.amount),
      data.type,
      data.category_id,
      data.target_wallet_id || undefined,
      new Date(data.created_at)
    );
  }

  async findByWalletId(walletId: string): Promise<Transaction[]> {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('wallet_id', walletId);

    if (error || !data) return [];

    return data.map(
      (item) =>
        new Transaction(
          item.id,
          item.wallet_id,
          Number(item.amount),
          item.type,
          item.category_id,
          item.target_wallet_id || undefined,
          new Date(item.created_at)
        )
    );
  }

  async findAll(): Promise<Transaction[]> {
    const { data, error } = await supabase.from('transactions').select('*');

    if (error) {
      throw new Error(`Lỗi khi lấy danh sách Transaction: ${error.message}`);
    }

    return data.map(
      (item) =>
        new Transaction(
          item.id,
          item.wallet_id,
          Number(item.amount),
          item.type,
          item.category_id,
          item.target_wallet_id || undefined,
          new Date(item.created_at)
        )
    );
  }
}