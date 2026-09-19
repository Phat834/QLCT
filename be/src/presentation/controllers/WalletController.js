import { CreateWalletUseCase } from '../../application/use-cases/CreateWalletUseCase.js';
import { UpdateWalletUseCase } from '../../application/use-cases/UpdateWalletUseCase.js';
import { DeleteWalletUseCase } from '../../application/use-cases/DeleteWalletUseCase.js';
import { SupabaseWalletRepository } from '../../infrastructure/database/SupabaseWalletRepository.js';
import { WalletType } from '../../domain/enums/WalletType.js';
const walletRepo = new SupabaseWalletRepository();
const createWalletUseCase = new CreateWalletUseCase(walletRepo);
const updateWalletUseCase = new UpdateWalletUseCase(walletRepo);
const deleteWalletUseCase = new DeleteWalletUseCase(walletRepo);
export class WalletController {
    async createWallet(req, res) {
        try {
            const { id, name, balance, type } = req.body;
            if (!id || !name || balance === undefined) {
                res.status(400).json({ error: 'Thiếu thông tin bắt buộc!' });
                return;
            }
            const walletType = type && Object.values(WalletType).includes(type) ? type : WalletType.AVAILABLE;
            const wallet = await createWalletUseCase.execute({ id, name, balance: Number(balance), type: walletType });
            res.status(201).json({ message: 'Tạo ví thành công!', data: wallet });
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    async updateWallet(req, res) {
        try {
            const id = String(req.params.id);
            const { name, balance, type } = req.body;
            if (!id || !name || balance === undefined) {
                res.status(400).json({ error: 'Thiếu thông tin bắt buộc!' });
                return;
            }
            const walletType = type && Object.values(WalletType).includes(type) ? type : WalletType.AVAILABLE;
            const wallet = await updateWalletUseCase.execute({ id, name, balance: Number(balance), type: walletType });
            res.status(200).json({ message: 'Cập nhật ví thành công!', data: wallet });
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    async deleteWallet(req, res) {
        try {
            const id = String(req.params.id);
            if (!id) {
                res.status(400).json({ error: 'Thiếu ID ví!' });
                return;
            }
            await deleteWalletUseCase.execute(id);
            res.status(200).json({ message: 'Xoá ví thành công!' });
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}
//# sourceMappingURL=WalletController.js.map