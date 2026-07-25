import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CreateExpenseUseCase } from '../application/use-cases/CreateExpenseUseCase.js';
import { Wallet } from '../domain/entities/Wallet.js';
import { Category } from '../domain/entities/Category.js';

describe('CreateExpenseUseCase', () => {
  let walletRepo: any;
  let categoryRepo: any;
  let transactionRepo: any;
  let useCase: CreateExpenseUseCase;

  beforeEach(() => {
    walletRepo = {
      findById: vi.fn(),
      save: vi.fn(),
      update: vi.fn(),
      findAll: vi.fn(),
    };
    categoryRepo = {
      save: vi.fn(),
      findById: vi.fn(),
      findAll: vi.fn(),
    };
    transactionRepo = {
      save: vi.fn(),
      findByWalletId: vi.fn(),
      findAll: vi.fn(),
    };

    useCase = new CreateExpenseUseCase(walletRepo, categoryRepo, transactionRepo);
  });

  it('should throw if wallet not found', async () => {
    walletRepo.findById.mockResolvedValue(null);
    await expect(useCase.execute({ id: 'tx-1', walletId: 'w1', categoryId: 'c1', amount: 100 })).rejects.toThrow('Không tìm thấy ví');
  });

  it('should throw if category not found', async () => {
    walletRepo.findById.mockResolvedValue(new Wallet('w1', 'Wallet', 1000));
    categoryRepo.findById.mockResolvedValue(null);
    await expect(useCase.execute({ id: 'tx-1', walletId: 'w1', categoryId: 'c1', amount: 100 })).rejects.toThrow('Không tìm thấy danh mục');
  });

  it('should withdraw and save transaction', async () => {
    const wallet = new Wallet('w1', 'Wallet', 1000);
    const category = new Category('c1', 'Food', 'icon');
    walletRepo.findById.mockResolvedValue(wallet);
    categoryRepo.findById.mockResolvedValue(category);
    walletRepo.save.mockResolvedValue();
    transactionRepo.save.mockResolvedValue();

    await useCase.execute({ id: 'tx-1', walletId: 'w1', categoryId: 'c1', amount: 100 });

    expect(wallet.getBalance()).toBe(900);
    expect(walletRepo.save).toHaveBeenCalledWith(wallet);
    expect(transactionRepo.save).toHaveBeenCalledOnce();
  });
});
