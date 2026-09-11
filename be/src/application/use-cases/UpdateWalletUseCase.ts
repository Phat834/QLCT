import { IWalletRepository } from '../../domain/repositories/IWalletRepository.js';
import { Wallet } from '../../domain/entities/Wallet.js';
import { WalletType } from '../../domain/enums/WalletType.js';

export interface UpdateWalletDTO {
  id: string;
  name: string;
  balance: number;
  type: WalletType;
}

export class UpdateWalletUseCase {
  constructor(private walletRepo: IWalletRepository) {}

  async execute(dto: UpdateWalletDTO): Promise<Wallet> {
    const existing = await this.walletRepo.findById(dto.id);
    if (!existing) throw new Error('Không tìm thấy ví!');

    const wallet = new Wallet(dto.id, dto.name, dto.balance, existing.getCreatedAt(), dto.type);
    await this.walletRepo.update(wallet);
    return wallet;
  }
}
