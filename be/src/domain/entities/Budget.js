export class Budget {
    id;
    categoryId;
    walletIds;
    limitAmount;
    currentSpent;
    dueDate;
    createdAt;
    constructor(categoryId, walletIds, limitAmount, currentSpent, id, dueDate = null, createdAt = new Date().toISOString()) {
        this.id = id;
        this.categoryId = categoryId;
        this.walletIds = walletIds;
        this.limitAmount = limitAmount;
        this.currentSpent = currentSpent;
        this.dueDate = dueDate;
        this.createdAt = createdAt;
    }
    getId() {
        return this.id;
    }
    getCategoryId() {
        return this.categoryId;
    }
    getWalletIds() {
        return this.walletIds;
    }
    getLimitAmount() {
        return this.limitAmount;
    }
    getCurrentSpent() {
        return this.currentSpent;
    }
    getDueDate() {
        return this.dueDate;
    }
    getCreatedAt() {
        return this.createdAt;
    }
    addExpense(amount) {
        this.currentSpent += amount;
    }
    getStatus() {
        const percentage = (this.currentSpent / this.limitAmount) * 100;
        if (percentage >= 100)
            return 'EXCEEDED_100';
        if (percentage >= 80)
            return 'WARNING_80';
        return 'NORMAL';
    }
}
//# sourceMappingURL=Budget.js.map