import { IWalletRepository } from '../../domain/repositories/IWalletRepository.js';

export class GetWalletsUseCase {
  constructor(private walletRepo: IWalletRepository) {}

  async execute() {
    return await this.walletRepo.findAll();
  }
}