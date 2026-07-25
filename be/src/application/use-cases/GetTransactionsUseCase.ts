// src/use-cases/GetTransactionsUseCase.ts
import { ITransactionRepository } from '../../domain/repositories/ITransactionRepository.js';

export class GetTransactionsUseCase {
  constructor(private transactionRepo: ITransactionRepository) {}

  async execute() {
    return await this.transactionRepo.findAll();
  }
}