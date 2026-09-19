export class GetCategoriesUseCase {
    categoryRepo;
    constructor(categoryRepo) {
        this.categoryRepo = categoryRepo;
    }
    async execute() {
        return await this.categoryRepo.findAll();
    }
}
//# sourceMappingURL=GetCategoriesUseCase.js.map