import { Pos } from './Pos';
import { Treasure } from './Treasure';
import { Item } from './Item';
import { Directions } from './Constants'

export class Player{
    public curPosition: Pos;
    public prePosition: Pos;
    public treasure?: Treasure;
    private inventory: Item[];

    constructor(pos: Pos){
        this.curPosition = pos;
        this.prePosition = pos;
        this.inventory = [];
    }

    public hasItem(itemName: string): boolean{
        let result: boolean = false;

        this.inventory.forEach(i => {
            if(i.name.toUpperCase() === itemName.toUpperCase()){
                result = true;
            }
        });

        return result;
    }

    public displayItemFunctionality(itemName: string): void{
        this.inventory.forEach(i => {
            if(i.name.toUpperCase() === itemName.toUpperCase()){
                console.log(i.functionality);
                return;
            }
        });
    }

    public addItem(item: Item): void{
        this.inventory.push(item);
    }

    public removeItem(itemName: string): void{
        console.log(`DEBUG: Removing iteam ${itemName}`);
        let index = this.inventory.findIndex(i => i.name.toUpperCase() === itemName.toUpperCase());
        console.log(`DEBUG: item index ${index}`);
        this.inventory.splice(index, 1);
        console.log(`DEBUG: Inventory after removing\n`);
        this.inventory.forEach(i => console.log(i.name + "\n"));
    }

    public displayInventory(): void{
        this.inventory.forEach(i => console.log(i.name));
    }

    public hasTreasure(): boolean{
        return this.treasure ? true : false;
    }

    public goToDirection(direction: string): void{

        console.log(`DEBUG: within goToDirection function, direction=${direction}`);

        this.prePosition.x = this.curPosition.x;
        this.prePosition.y = this.curPosition.y;

        if(direction.toUpperCase() === Directions.WEST){
            this.curPosition.x--;
        }

        if(direction.toUpperCase() === Directions.EAST){
            this.curPosition.x++;
        }

        if(direction.toUpperCase() === Directions.NORTH){
            this.curPosition.y--;
        }

        if(direction.toUpperCase() === Directions.SOUTH){
            this.curPosition.y++;
        }

        console.log(`DEBUG: After go direction position: {${this.curPosition.y}, ${this.curPosition.x}}`);
    }
}