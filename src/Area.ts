import { Hazard } from './Hazard';
import { Item } from './Item';
import {Treasure } from './Treasure';
import { Pos } from './Pos';

export class Area{
    private _name: string;
    private _pos: Pos;
    private _isExit: boolean;
    public item?: Item;
    public hazard?: Hazard;
    public treasure?: Treasure;
    
    constructor(name: string, pos: Pos, isExit: boolean){
        this._name = name;
        this._pos = pos;
        this._isExit = isExit;
        this.item = undefined;
    }

    get name(): string{
        return this._name;
    }

    get position(): Pos{
        return this._pos;
    }

    get isExit(): boolean{
        return this._isExit;
    }

    public description(): string{
        let desc: string = this.name.toUpperCase() + "\n";
        desc += "You are in the " + this.name.toLowerCase() + ".\n";
       
        if(this.item){
            desc += "There is a " + this.item.name + " on the table.\n";
            desc += this.item.functionality + "\n";
        }

        if(this.hazard){
            desc += this.hazard.description + "\n";
        }

        if(this.treasure){
            desc += "There is a " + this.treasure.name + " in the closet.\n";
        }

        return desc;
    }
}