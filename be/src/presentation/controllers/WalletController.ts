import { Request, Response } from 'express';
import { CreateWalletUseCase } from '../../application/use-cases/CreateWalletUseCase.js';
import { UpdateWalletUseCase } from '../../application/use-cases/UpdateWalletUseCase.js';
import { DeleteWalletUseCase } from '../../application/use-cases/DeleteWalletUseCase.js';
import { SupabaseWalletRepository } from '../../infrastructure/database/SupabaseWalletRepository.js';

const walletRepo = new SupabaseWalletRepository();
const createWalletUseCase = new CreateWalletUseCase(walletRepo);
const updateWalletUseCase = new UpdateWalletUseCase(walletRepo);
const deleteWalletUseCase = new DeleteWalletUseCase(walletRepo);

export class WalletController {
  async createWallet(req: Request, res: Response): Promise<void> {
    try {
      const { id, name, balance } = req.body;
      if (!id || !name || balance === undefined) {
        res.status(400).json({ error: 'Thiếu thông tin bắt buộc!' });
        return;
      }
      const wallet = await createWalletUseCase.execute({ id, name, balance: Number(balance) });
      res.status(201).json({ message: 'Tạo ví thành công!', data: wallet });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async updateWallet(req: Request, res: Response): Promise<void> {
    try {
      const id = String(req.params.id);
      const { name, balance } = req.body;
      if (!id || !name || balance === undefined) {
        res.status(400).json({ error: 'Thiếu thông tin bắt buộc!' });
        return;
      }
      const wallet = await updateWalletUseCase.execute({ id, name, balance: Number(balance) });
      res.status(200).json({ message: 'Cập nhật ví thành công!', data: wallet });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async deleteWallet(req: Request, res: Response): Promise<void> {
    try {
      const id = String(req.params.id);
      if (!id) {
        res.status(400).json({ error: 'Thiếu ID ví!' });
        return;
      }
      await deleteWalletUseCase.execute(id);
      res.status(200).json({ message: 'Xoá ví thành công!' });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}
