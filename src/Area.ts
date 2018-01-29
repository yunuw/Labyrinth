import { Hazard } from './Hazard';
import { Item } from './Item';
import { Treasure } from './Treasure';
import { Pos } from './Pos';

export class Area {
    private _name: string;
    private _pos: Pos;
    private _isExit: boolean;
    public item?: Item;
    public hazard?: Hazard;
    public treasure?: Treasure;

    constructor(name: string, pos: Pos, isExit: boolean) {
        this._name = name.toUpperCase();
        this._pos = pos;
        this._isExit = isExit;
        this.item = undefined;
    }

    get name(): string {
        return this._name;
    }

    get position(): Pos {
        return this._pos;
    }

    get isExit(): boolean {
        return this._isExit;
    }

    public displayDescription(): void {
        console.log(this.name);
        console.log("You are in the " + this.name + ".");

        if (this.item) {
            console.log("There is a " + this.item.name + " on the table.");
            console.log(this.item.functionality);
        }

        if (this.hazard) {
            console.log(this.hazard.description);
        }

        if (this.treasure) {
            console.log("There is a " + this.treasure.name + " in the closet.");
        }
    }
}