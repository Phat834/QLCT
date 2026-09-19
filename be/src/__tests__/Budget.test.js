import { describe, it, expect } from 'vitest';
import { Budget } from '../domain/entities/Budget.js';
describe('Budget', () => {
    it('should calculate status correctly', () => {
        const budget = new Budget('c1', ['w1'], 100, 0, 'b1');
        expect(budget.getStatus()).toBe('NORMAL');
        const budget2 = new Budget('c2', ['w2'], 200, 0, 'b2');
        budget2.addExpense(190);
        expect(budget2.getStatus()).toBe('WARNING_80');
        const budget3 = new Budget('c3', ['w3'], 200, 0, 'b3');
        budget3.addExpense(250);
        expect(budget3.getStatus()).toBe('EXCEEDED_100');
    });
});
//# sourceMappingURL=Budget.test.js.map