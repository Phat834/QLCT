import { IWalletRepository } from '../../domain/repositories/IWalletRepository.js';
import { Wallet } from '../../domain/entities/Wallet.js';

export interface CreateWalletDTO {
  id: string;
  name: string;
  balance: number;
}

export class CreateWalletUseCase {
  constructor(private walletRepo: IWalletRepository) {}

  async execute(dto: CreateWalletDTO): Promise<Wallet> {
    const wallet = new Wallet(dto.id, dto.name, dto.balance);
    await this.walletRepo.save(wallet);
    return wallet;
  }
}