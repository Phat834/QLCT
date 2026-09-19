export class Category {
    id;
    name;
    icon;
    createdAt;
    constructor(id, name, icon, createdAt = new Date().toISOString()) {
        this.id = id;
        this.name = name;
        this.icon = icon;
        this.createdAt = createdAt;
    }
    getId() {
        return this.id;
    }
    getName() {
        return this.name;
    }
    getIcon() {
        return this.icon;
    }
    getCreatedAt() {
        return this.createdAt;
    }
}
//# sourceMappingURL=Category.js.map