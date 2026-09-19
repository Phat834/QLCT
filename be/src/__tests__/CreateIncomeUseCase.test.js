import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CreateIncomeUseCase } from '../application/use-cases/CreateIncomeUseCase.js';
import { Wallet } from '../domain/entities/Wallet.js';
describe('CreateIncomeUseCase', () => {
    let walletRepo;
    let transactionRepo;
    let useCase;
    beforeEach(() => {
        walletRepo = {
            findById: vi.fn(),
            save: vi.fn(),
            update: vi.fn(),
            findAll: vi.fn(),
        };
        transactionRepo = {
            save: vi.fn(),
            findByWalletId: vi.fn(),
            findAll: vi.fn(),
        };
        useCase = new CreateIncomeUseCase(transactionRepo, walletRepo);
    });
    it('should deposit and save transaction', async () => {
        const wallet = new Wallet('w1', 'Wallet', 1000);
        walletRepo.findById.mockResolvedValue(wallet);
        walletRepo.update.mockResolvedValue();
        transactionRepo.save.mockResolvedValue();
        const result = await useCase.execute({ id: 'tx-1', walletId: 'w1', categoryId: 'c1', amount: 100 });
        expect(wallet.getBalance()).toBe(1100);
        expect(walletRepo.update).toHaveBeenCalledWith(wallet);
        expect(transactionRepo.save).toHaveBeenCalledOnce();
        expect(result.getId()).toBe('tx-1');
    });
});
//# sourceMappingURL=CreateIncomeUseCase.test.js.map