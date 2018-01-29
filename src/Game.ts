import { Item } from './Item';
import { Hazard } from './Hazard';
import { Pos } from './Pos';
import { Treasure } from './Treasure';
import { Area } from './Area';
import { Player } from './Player';
import { Monster } from './Monster';
import { Command, CommandParser } from './Parser';
import { Direction } from './Constants';

export class Game {
    map: Area[][];
    player: Player;
    monster: Monster;
    private parser: CommandParser;
    mapSize: number;

    /**
     * When the player meet the monster in the same room, change the value of the vairable to true.
     * Which means the player has already been informed that she is in the same room with the monster.
     */
    private isInformed: boolean = false;

    constructor() {
        let parsedJSON = require('../src/map.json');
        this.mapSize = parsedJSON.mapSize;
        this.initializeMap(this.mapSize, parsedJSON.area);
        this.player = new Player(new Pos(parsedJSON.player.x, parsedJSON.player.x));
        this.monster = new Monster(false, new Pos(parsedJSON.monster.x, parsedJSON.monster.y), Direction.WEST, this.mapSize);
        this.parser = new CommandParser(
            (cmd: Command, arg: string) => this.handleInput(cmd, arg)
        );
    }

    private initializeMap(mapSize: number, area: any[]): void {
        this.map = new Array<Array<Area>>();

        for (let rowIndex = 0; rowIndex < mapSize; rowIndex++) {
            this.map[rowIndex] = new Array<Area>(mapSize);
        }

        for (let i: number = 0; i < mapSize; i++) {
            for (let j: number = 0; j < mapSize; j++) {
                let index: number = i * mapSize + j;
                this.map[i][j] = new Area(area[index].name, new Pos(j, i), area[index].isExit);

                if (area[index].item) {
                    this.map[i][j].item = new Item(area[index].item.name, area[index].item.functionality);
                }

                if (area[index].hazard) {
                    let item = new Item(area[index].hazard.item.name, area[index].hazard.item.functionality);
                    this.map[i][j].hazard = new Hazard(area[index].hazard.description, item);
                }

                if (area[index].treasure) {
                    this.map[i][j].treasure = new Treasure(area[index].treasure.name);
                }
            }
        }

        // let item1 = new Item("extinguisher", "You can use it to put out the fire.");
        // let item2 = new Item("key", "You can use it to open a locked door.");
        // let item3 = new Item("flashlight", "You can use it to light up the room.");
        // this.map[0][0] = new Area("Red Square", new Pos(0, 0), true);
        // this.map[0][1] = new Area("Kane Hall", new Pos(1, 0), false);
        // this.map[0][1].item = item1;
        // this.map[0][2] = new Area("Suzzallo Library", new Pos(2, 0), false);
        // this.map[1][0] = new Area("Meany Hall", new Pos(0, 2), false);
        // this.map[1][0].item = item2;
        // this.map[1][1] = new Area("Mary Gates Hall", new Pos(1, 1), false);
        // this.map[1][1].item = item3;
        // this.map[1][1].hazard = new Hazard("There is a wall of flames.", item1);
        // this.map[1][2] = new Area("Johnson Hall", new Pos(2, 1), false);
        // this.map[1][2].hazard = new Hazard("It is pitch black here, you cannot see where the door is.", item3);
        // this.map[2][0] = new Area("Bagley Hall", new Pos(0, 2), false);
        // this.map[2][0].item = new Item("sword", "You can use it to kill the monster.");
        // this.map[2][1] = new Area("Allen Library", new Pos(1, 2), false);
        // this.map[2][1].hazard = new Hazard("You're locked in a big closet.", item2);
        // this.map[2][2] = new Area("Drumheller Fountain", new Pos(2, 2), false);
        // this.map[2][2].treasure = new Treasure("treasure");
    }

    /**
     * Check whether the request move is valid. 
     * If it's valid, update the position of the player and check the current status of the game. If not, provide hint accordingly. 
     * The function return true if the game continues, otherwise return false.
     * @param direction direction input provided by the user
     */
    private handleGo(direction: string): boolean {
        /**
         * Check whether the argument entere by the use is valid.
         */
        if (direction !== Direction.WEST && direction !== Direction.EAST && direction !== Direction.SOUTH && direction !== Direction.NORTH) {
            console.log(`Invalid argument. Possible directions are north, south, east, and west`);
            return true;
        }

        /**
         * The player can only go back if the hazard hasn't been conquered.
         */
        if (this.getCurrentArea().hazard) {
            let difX: number = this.player.curPos.x - this.player.prePos.x;
            let difY: number = this.player.curPos.y - this.player.prePos.y;
            let direc: Direction;

            if (difX > 0) {
                direc = Direction.WEST;
            }
            else if (difX < 0) {
                direc = Direction.EAST;
            }
            else if (difY > 0) {
                direc = Direction.NORTH;
            }
            else {
                direc = Direction.SOUTH;
            }

            //console.log(`DEBUG: difx:${difX}, dify:${difY}, direc:${direc}`);

            if (direction !== direc) {
                console.log(`You can only go ${direc} before you conquer the hazard!`);
                return true;
            }
        }

        if (this.isPlayerOnBorder(direction)) {
            return true;
        }

        this.player.goToDirection(Direction[direction]);

        if (!this.checkGameStatus()) {
            return false;
        }

        //console.log("DEBUG: position is: " + this.getCurrentArea().position.y + ", " + this.getCurrentArea().position.x);

        this.getCurrentArea().displayDescription();
        return true;
    }

    /**
     * Check whether the user is on the border.
     * If yes, provide hint accordingly and return true. Otherwise, return false.
     * @param direction direction input provided by user
     */
    private isPlayerOnBorder(direction: Direction): boolean {
        if ((direction === Direction.WEST && this.player.curPos.x === 0)
            || (direction === Direction.EAST && this.player.curPos.x === this.mapSize - 1)
            || (direction === Direction.NORTH && this.player.curPos.y === 0)
            || (direction === Direction.SOUTH && this.player.curPos.y === this.mapSize - 1)) {
            console.log(`Sorry. You cannot go ${direction}!`);
            return true;
        }

        return false;
    }

    private handleLook(targetName: string): void {
        targetName = targetName.toUpperCase();

        if (this.player.hasItem(targetName)) {
            this.player.getItem(targetName).displayFunctionality();
            //todo this.player.displayItemFunctionality(targetName);
        }
        else if (targetName === "AREA") {
            this.getCurrentArea().displayDescription();
        }
        else {
            console.log(`Invalid argument.\nYou could enter an item name to get the detail of the item.`);
            console.log(`Or you could enter 'Look area' to get the detail of the current area.`);
        }
    }

    private handleTake(itemName: string): void {
        if (this.getCurrentArea().item && itemName.toUpperCase() === this.getCurrentArea().item!.name.toUpperCase()) {
            this.player.addItem(this.getCurrentArea().item!);
            this.getCurrentArea().item = undefined;
            console.log(`Now you have a ${itemName}`);
        }
        else if (this.getCurrentArea().treasure && itemName.toUpperCase() === "TREASURE") {
            this.player.treasure = this.getCurrentArea().treasure;
            this.getCurrentArea().treasure = undefined;
            console.log(`Now you've got the treasure!`)
        }
        else {
            console.log(`There isn't a ${itemName} in this area.`);
            console.log(`If you want to take the `);
        }
    }

    private handleUse(itemName: string): void {
        if (this.player.hasItem(itemName)) {
            if (itemName === "SWORD") {
                if (this.player.curPos.x === this.monster.position.x && this.player.curPos.y === this.monster.position.y) {
                    this.monster.isDead = true;
                    console.log(`The monster has been killed.`);
                }
            } else if (this.getCurrentArea().hazard && this.getCurrentArea().hazard!.canBeCouqueredBy(itemName)) {
                this.getCurrentArea().hazard = undefined;
                console.log(`You have conquered the hazard.`);
            }
            this.player.removeItem(itemName);
            console.log(`You have used item ${itemName}`);
        } else {
            console.log(`You don't have such item.`)
        }
    }

    private handleInventory(): void {
        this.player.displayInventory();
    }

    /**
    * Check the current status of the game and react accordingly.
    * If the game continues, return true, otherwise, return false.
    */
    private checkGameStatus(): boolean {
        //console.log(`DEBUG: checking status: user position ${this.player.curPos.y} ${this.player.curPos.x}`);
        //console.log(`DEBUG: checking status: monster position ${this.monster.position.y} ${this.monster.position.x}`);

        /**
         * When the player is in the same room with the monster, 
         * and the player doesn't have a sword, the player die, the game ends, and return false.
         */
        if (!this.monster.isDead && this.player.curPos.x === this.monster.position.x && this.player.curPos.y === this.monster.position.y) {
            if (this.player.hasItem("SWORD")) {
                if (!this.isInformed) {
                    console.log(`There is a monster in front of you. You could be killed by the monster.`);
                    console.log(`BUT you have a sword! Kill the monster.`);
                    console.log(`Be Quick! You don't have much time left.`);
                    /**
                     * The player has already been informed she is in the same room with monster.
                     */
                    this.isInformed = true;
                }
            }
            else {
                console.log(`There is a monster in front of you. Unfortunately, you don't have a sword.`);
                console.log(`You're killed. Game Over!`);
                return false;
            }
        }

        /**
         * When the player is at the exit with treasure, the player wins and the game ends.
         */
        if (this.player.hasTreasure() && this.getCurrentArea().isExit) {
            console.log(`Congrats. You've arrived the exit with the treasure. You Win!`);
            return false;
        }

        return true;
    }

    private handleInput(cmd: Command, arg: string): boolean {
        arg = arg.toUpperCase();

        /**
         * When the player has been informed that she is in the same room with monster and the player has a sword,
         * if the player didn't use the sword, she'll be killed by the monster and game ends.
         */
        if (!this.monster.isDead && this.isInformed && this.player.curPos.x === this.monster.position.x
            && this.player.curPos.y === this.monster.position.y
            && (cmd !== Command.USE || arg.toUpperCase() != "SWORD")) {
            console.log(`Sorry! You've lost the chance to kill the monster.\nYou've eaten by the monster. Game Over!`);
            return false;
        }

        if (cmd === Command.GO) {
            if (!this.handleGo(arg)) {
                return false;
            }
        }

        if (cmd === Command.LOOK) {
            this.handleLook(arg);
        }

        if (cmd === Command.TAKE) {
            this.handleTake(arg);
        }

        if (cmd === Command.USE) {
            this.handleUse(arg);
        }

        if (cmd === Command.INVENTORY) {
            this.handleInventory();
        }

        /**
         * For every action the player takes, no matter valid or not,if the monster is still alive, it will move once.
         */
        if (!this.monster.isDead && !this.isInformed) {
            //console.log(`DEBUG: Monster moving to ${this.monster.nextStep} after player take action`);                        
            this.monster.moveToNextPosition();
            //console.log(`DEGUG: Monster's nextstep is: ${this.monster.nextStep}`);
        }

        if (this.checkGameStatus()) {
            console.log(`What would you like to do?`);
            return true;
        }

        return false;
    }

    private getCurrentArea(): Area {
        let playerPos: Pos = this.player.curPos;
        return this.map[playerPos.y][playerPos.x];
    }

    start() {
        this.getCurrentArea().displayDescription();
        console.log(`What would you like to do?`);
        this.parser.start();
    }
}
