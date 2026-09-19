import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CreateTransferUseCase } from '../application/use-cases/CreateTransferUseCase.js';
import { Wallet } from '../domain/entities/Wallet.js';
describe('CreateTransferUseCase', () => {
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
        useCase = new CreateTransferUseCase(walletRepo, transactionRepo);
    });
    it('should throw if source and target wallet are the same', async () => {
        await expect(useCase.execute({ id: 'tx-1', fromWalletId: 'w1', toWalletId: 'w1', amount: 100 })).rejects.toThrow('Ví nguồn và ví đích không được trùng nhau');
    });
    it('should throw if source wallet not found', async () => {
        walletRepo.findById.mockResolvedValue(null);
        await expect(useCase.execute({ id: 'tx-1', fromWalletId: 'w1', toWalletId: 'w2', amount: 100 })).rejects.toThrow('Ví nguồn không tồn tại');
    });
    it('should transfer funds between wallets', async () => {
        const fromWallet = new Wallet('w1', 'From', 1000);
        const toWallet = new Wallet('w2', 'To', 500);
        walletRepo.findById.mockImplementation((id) => Promise.resolve(id === 'w1' ? fromWallet : toWallet));
        walletRepo.save.mockResolvedValue();
        transactionRepo.save.mockResolvedValue();
        const result = await useCase.execute({ id: 'tx-1', fromWalletId: 'w1', toWalletId: 'w2', amount: 100 });
        expect(fromWallet.getBalance()).toBe(900);
        expect(toWallet.getBalance()).toBe(600);
        expect(walletRepo.save).toHaveBeenCalledTimes(2);
        expect(transactionRepo.save).toHaveBeenCalledOnce();
        expect(result.getId()).toBe('tx-1');
    });
});
//# sourceMappingURL=CreateTransferUseCase.test.js.map