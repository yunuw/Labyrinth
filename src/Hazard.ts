import { Item } from './Item';

export class Hazard{
    private _description: string;
    private _item: Item;

    constructor(description: string, item: Item){
        this._description = description;
        this._item = item;
    }

    get description(): string{
        return this._description;
    }

    get item(): Item{
        return this._item;
    }
}