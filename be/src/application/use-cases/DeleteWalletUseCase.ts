import { IWalletRepository } from '../../domain/repositories/IWalletRepository.js';

export class DeleteWalletUseCase {
  constructor(private walletRepo: IWalletRepository) {}

  async execute(id: string): Promise<void> {
    await this.walletRepo.delete(id);
  }
}
