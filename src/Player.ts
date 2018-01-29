import { Pos } from './Pos';
import { Treasure } from './Treasure';
import { Item } from './Item';
import { Direction } from './Constants'

export class Player {
    public curPos: Pos;
    public prePos: Pos;
    public treasure?: Treasure;
    private inventory: Item[];

    constructor(pos: Pos) {
        this.curPos = new Pos(pos.x, pos.y);
        this.prePos = new Pos(pos.x, pos.y);
        this.inventory = [];
    }

    public hasItem(itemName: string): boolean {
        return this.inventory.findIndex(i => i.name === itemName) >= 0;
    }

    public getItem(itemName: string): Item {
        let item: Item = undefined!;

        this.inventory.forEach(i => {
            if (i.name === itemName) {
                item = i;
            }
        });

        return item;
    }

    public addItem(item: Item): void {
        this.inventory.push(item);
    }

    public removeItem(itemName: string): void {
        //console.log(`DEBUG: Removing iteam ${itemName}`);
        let index = this.inventory.findIndex(i => i.name === itemName);
        //console.log(`DEBUG: item index ${index}`);
        this.inventory.splice(index, 1);
        //console.log(`DEBUG: Inventory after removing\n`);
        //this.inventory.forEach(i => console.log(i.name));
    }

    public displayInventory(): void {
        let isEmpty: boolean = true;

        this.inventory.forEach(i => {
            console.log(i.name);
            isEmpty = false;
        });

        if (isEmpty) {
            console.log(`Your inventory is now empty. Go to other places to find items.`);
        }
    }

    public hasTreasure(): boolean {
        return this.treasure ? true : false;
    }

    public goToDirection(direction: Direction): void {

        //console.log(`DEBUG: within goToDirection function, direction=${direction}`);

        this.prePos.x = this.curPos.x;
        this.prePos.y = this.curPos.y;

        if (direction.toUpperCase() === Direction.WEST) {
            this.curPos.x--;
        }

        if (direction.toUpperCase() === Direction.EAST) {
            this.curPos.x++;
        }

        if (direction.toUpperCase() === Direction.NORTH) {
            this.curPos.y--;
        }

        if (direction.toUpperCase() === Direction.SOUTH) {
            this.curPos.y++;
        }

        //console.log(`DEBUG: After go direction position: {${this.curPos.y}, ${this.curPos.x}}`);
    }
}