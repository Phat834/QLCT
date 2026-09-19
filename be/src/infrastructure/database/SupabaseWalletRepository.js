import { supabase } from './supabaseClient.js';
import { Wallet } from '../../domain/entities/Wallet.js';
import { WalletType } from '../../domain/enums/WalletType.js';
export class SupabaseWalletRepository {
    async save(wallet) {
        const { error } = await supabase
            .from('wallets')
            .upsert({
            id: wallet.getId(),
            name: wallet.getName(),
            balance: wallet.getBalance(),
            created_at: wallet.getCreatedAt().toISOString(),
            type: wallet.getType(),
        });
        if (error) {
            throw new Error(`Lỗi khi lưu Wallet: ${error.message}`);
        }
    }
    async update(wallet) {
        await this.save(wallet);
    }
    async findById(id) {
        const { data, error } = await supabase
            .from('wallets')
            .select('*')
            .eq('id', id)
            .single();
        if (error || !data) {
            return null;
        }
        return new Wallet(data.id, data.name, Number(data.balance), new Date(data.created_at), data.type || WalletType.AVAILABLE);
    }
    async findAll() {
        const { data, error } = await supabase.from('wallets').select('*').order('created_at', { ascending: true });
        if (error) {
            throw new Error(`Lỗi khi lấy danh sách Wallet: ${error.message}`);
        }
        return data.map((item) => new Wallet(item.id, item.name, Number(item.balance), new Date(item.created_at), item.type || WalletType.AVAILABLE));
    }
    async delete(id) {
        const { error } = await supabase
            .from('wallets')
            .delete()
            .eq('id', id);
        if (error) {
            throw new Error(`Lỗi khi xoá Wallet: ${error.message}`);
        }
    }
}
//# sourceMappingURL=SupabaseWalletRepository.js.map