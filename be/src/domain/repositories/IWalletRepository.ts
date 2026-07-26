import { Wallet } from '../entities/Wallet.js';

export interface IWalletRepository {
  findById(id: string): Promise<Wallet | null>;
  save(wallet: Wallet): Promise<void>;
  update(wallet: Wallet): Promise<void>;
  delete(id: string): Promise<void>;
  findAll(): Promise<Wallet[]>;
}