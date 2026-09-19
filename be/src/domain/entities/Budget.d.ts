export declare class Budget {
    private id;
    private categoryId;
    private walletIds;
    private limitAmount;
    private currentSpent;
    private dueDate;
    private createdAt;
    constructor(categoryId: string, walletIds: string[], limitAmount: number, currentSpent: number, id: string, dueDate?: string | null, createdAt?: string);
    getId(): string;
    getCategoryId(): string;
    getWalletIds(): string[];
    getLimitAmount(): number;
    getCurrentSpent(): number;
    getDueDate(): string | null;
    getCreatedAt(): string;
    addExpense(amount: number): void;
    getStatus(): 'NORMAL' | 'WARNING_80' | 'EXCEEDED_100';
}
//# sourceMappingURL=Budget.d.ts.map