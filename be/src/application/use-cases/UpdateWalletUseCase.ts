import { IWalletRepository } from '../../domain/repositories/IWalletRepository.js';
import { Wallet } from '../../domain/entities/Wallet.js';

export interface UpdateWalletDTO {
  id: string;
  name: string;
  balance: number;
}

export class UpdateWalletUseCase {
  constructor(private walletRepo: IWalletRepository) {}

  async execute(dto: UpdateWalletDTO): Promise<Wallet> {
    const existing = await this.walletRepo.findById(dto.id);
    if (!existing) throw new Error('Không tìm thấy ví!');

    const wallet = new Wallet(dto.id, dto.name, dto.balance);
    await this.walletRepo.update(wallet);
    return wallet;
  }
}
