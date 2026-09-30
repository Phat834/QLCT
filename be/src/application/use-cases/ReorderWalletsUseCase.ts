import { IWalletRepository } from '../../domain/repositories/IWalletRepository.js';

export class ReorderWalletsUseCase {
  constructor(private walletRepo: IWalletRepository) {}

  async execute(items: { id: string; sortOrder: number }[]): Promise<void> {
    await this.walletRepo.updateSortOrder(items);
  }
}