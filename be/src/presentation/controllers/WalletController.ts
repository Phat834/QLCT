import { Request, Response } from 'express';
import { CreateWalletUseCase } from '../../application/use-cases/CreateWalletUseCase.js';
import { SupabaseWalletRepository } from '../../infrastructure/database/SupabaseWalletRepository.js';

const walletRepo = new SupabaseWalletRepository();
const createWalletUseCase = new CreateWalletUseCase(walletRepo);

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
}
