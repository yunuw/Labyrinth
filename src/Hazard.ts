import { Item } from './Item';

export class Hazard {
    private _description: string;
    private item: Item;

    constructor(description: string, item: Item) {
        this._description = description;
        this.item = item;
    }

    get description(): string {
        return this._description;
    }

    public canBeCouqueredBy(itemName: string): boolean {
        if (this.item.name === itemName) {
            return true;
        }

        return false;
    }
}