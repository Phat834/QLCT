export class DeleteCategoryUseCase {
    categoryRepo;
    constructor(categoryRepo) {
        this.categoryRepo = categoryRepo;
    }
    async execute(id) {
        await this.categoryRepo.delete(id);
    }
}
//# sourceMappingURL=DeleteCategoryUseCase.js.map