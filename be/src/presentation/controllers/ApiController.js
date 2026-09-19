export class ApiController {
    getTransactionsUseCase;
    getWalletsUseCase;
    getCategoriesUseCase;
    getBudgetsUseCase;
    getBudgetByCategoryUseCase;
    createCategoryUseCase;
    updateCategoryUseCase;
    deleteCategoryUseCase;
    createBudgetUseCase;
    updateBudgetUseCase;
    deleteBudgetUseCase;
    constructor(getTransactionsUseCase, getWalletsUseCase, getCategoriesUseCase, getBudgetsUseCase, getBudgetByCategoryUseCase, createCategoryUseCase, updateCategoryUseCase, deleteCategoryUseCase, createBudgetUseCase, updateBudgetUseCase, deleteBudgetUseCase) {
        this.getTransactionsUseCase = getTransactionsUseCase;
        this.getWalletsUseCase = getWalletsUseCase;
        this.getCategoriesUseCase = getCategoriesUseCase;
        this.getBudgetsUseCase = getBudgetsUseCase;
        this.getBudgetByCategoryUseCase = getBudgetByCategoryUseCase;
        this.createCategoryUseCase = createCategoryUseCase;
        this.updateCategoryUseCase = updateCategoryUseCase;
        this.deleteCategoryUseCase = deleteCategoryUseCase;
        this.createBudgetUseCase = createBudgetUseCase;
        this.updateBudgetUseCase = updateBudgetUseCase;
        this.deleteBudgetUseCase = deleteBudgetUseCase;
    }
    async getTransactions(_req, res) {
        const list = await this.getTransactionsUseCase.execute();
        res.json(list);
    }
    async getWallets(_req, res) {
        const wallets = await this.getWalletsUseCase.execute();
        res.json(wallets);
    }
    async getCategories(_req, res) {
        const categories = await this.getCategoriesUseCase.execute();
        res.json(categories);
    }
    async createCategory(req, res) {
        try {
            const { id, name, icon } = req.body;
            if (!id || !name) {
                res.status(400).json({ error: 'Thiếu thông tin bắt buộc!' });
                return;
            }
            const category = await this.createCategoryUseCase.execute({ id, name, icon: icon || 'default-icon' });
            res.status(201).json({ message: 'Tạo danh mục thành công!', data: category });
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    async updateCategory(req, res) {
        try {
            const id = String(req.params.id);
            const { name, icon } = req.body;
            if (!name) {
                res.status(400).json({ error: 'Thiếu tên danh mục!' });
                return;
            }
            const category = await this.updateCategoryUseCase.execute({ id, name, icon: icon || 'default-icon' });
            res.status(200).json({ message: 'Cập nhật danh mục thành công!', data: category });
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    async deleteCategory(req, res) {
        try {
            const id = String(req.params.id);
            if (!id) {
                res.status(400).json({ error: 'Thiếu ID danh mục!' });
                return;
            }
            await this.deleteCategoryUseCase.execute(id);
            res.status(200).json({ message: 'Xoá danh mục thành công!' });
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    async createBudget(req, res) {
        try {
            const { id, categoryId, walletIds, limitAmount, dueDate } = req.body;
            if (!id || !categoryId || !walletIds || !Array.isArray(walletIds) || walletIds.length === 0 || limitAmount === undefined) {
                res.status(400).json({ error: 'Thiếu thông tin bắt buộc!' });
                return;
            }
            const budget = await this.createBudgetUseCase.execute({ id, categoryId, walletIds, limitAmount: Number(limitAmount), dueDate: dueDate ?? null });
            res.status(201).json({ message: 'Tạo ngân sách thành công!', data: budget });
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    async updateBudget(req, res) {
        try {
            const id = String(req.params.id);
            const { categoryId, walletIds, limitAmount, dueDate } = req.body;
            if (!id || !categoryId || !walletIds || !Array.isArray(walletIds) || walletIds.length === 0 || limitAmount === undefined) {
                res.status(400).json({ error: 'Thiếu thông tin bắt buộc!' });
                return;
            }
            const budget = await this.updateBudgetUseCase.execute({ id, categoryId, walletIds: walletIds || undefined, limitAmount: Number(limitAmount), dueDate: dueDate ?? null });
            res.status(200).json({ message: 'Cập nhật ngân sách thành công!', data: budget });
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    async deleteBudget(req, res) {
        try {
            const id = String(req.params.id);
            if (!id) {
                res.status(400).json({ error: 'Thiếu ID ngân sách!' });
                return;
            }
            await this.deleteBudgetUseCase.execute(id);
            res.status(200).json({ message: 'Xoá ngân sách thành công!' });
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    async getBudgets(_req, res) {
        const budgets = await this.getBudgetsUseCase.execute();
        res.json(budgets);
    }
    async getBudgetByCategory(req, res) {
        const categoryId = req.params.categoryId;
        if (!categoryId || Array.isArray(categoryId)) {
            res.status(400).json({ error: 'Thiếu categoryId' });
            return;
        }
        const budget = await this.getBudgetByCategoryUseCase.execute({ categoryId });
        res.json(budget);
    }
}
//# sourceMappingURL=ApiController.js.map