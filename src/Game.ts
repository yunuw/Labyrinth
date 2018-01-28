import { Item } from './Item';
import { Hazard } from './Hazard';
import { Pos } from './Pos';
import { Treasure } from './Treasure';
import { Area } from './Area';
import { Player } from './Player';
import { Monster } from './Monster';
import { Command, CommandParser } from './Parser';
import { MapSize, Directions } from './Constants';

export class Game {
    map: Area[][];
    player: Player;
    monster: Monster;
    private parser: CommandParser;
    private isInformed: boolean = false;

    constructor() {
        this.initializeMap();
        this.player = new Player(new Pos(0, 0));
        this.monster = new Monster(new Pos(2, 2), false, Directions.WEST);
        this.parser = new CommandParser(
            (cmd: Command, arg: string) => this.handleInput(cmd, arg)
        );
    }

    private initializeMap(): void {
        this.map = new Array<Array<Area>>();

        for (let rowIndex = 0; rowIndex < MapSize; rowIndex++) {
            this.map[rowIndex] = new Array<Area>(MapSize);
        }

        let item1 = new Item("extinguisher", "You can use the extinguisher to put out the fire.");
        let item2 = new Item("key", "You can use the key to open a locked door.");
        let item3 = new Item("flashlight", "You can use the flashlight to light up the room.");
        this.map[0][0] = new Area("Red Square", new Pos(0, 0), true);
        this.map[0][1] = new Area("Kane Hall", new Pos(1, 0), false);
        this.map[0][1].item = item1;
        this.map[0][2] = new Area("Suzzallo Library", new Pos(2, 0), false);
        this.map[1][0] = new Area("Meany Hall", new Pos(0, 2), false);
        this.map[1][0].item = item2;
        this.map[1][1] = new Area("Mary Gates Hall", new Pos(1, 1), false);
        this.map[1][1].item = item3;
        this.map[1][1].hazard = new Hazard("There is a wall of flames.", item1);
        this.map[1][2] = new Area("Johnson Hall", new Pos(2, 1), false);
        this.map[1][2].hazard = new Hazard("It is pitch black here, you cannot see where the door is.", item3);
        this.map[2][0] = new Area("Bagley Hall", new Pos(0, 2), false);
        this.map[2][0].item = new Item("sword", "You can use the sword to kill the monster.");
        this.map[2][1] = new Area("Allen Library", new Pos(1, 2), false);
        this.map[2][1].hazard = new Hazard("You're locked in a big closet.", item2);
        this.map[2][2] = new Area("Drumheller Fountain", new Pos(2, 2), false);
        this.map[2][2].treasure = new Treasure("a box of gold bars");
    }

    /**
     * If the user entered command 'GO' and the move is valid, the position of the player will be updated and return true.
     * Otherwise, it will provide some hint accordingly for the user and return false.
     * @param arg user provided argument
     */
    private handleGo(arg: string): boolean {
        let curPos: Pos = this.player.curPosition;
        arg = arg.toUpperCase();

        /**
         * Check whether the argument entere by the use is valid.
         */
        if (arg !== Directions.WEST && arg !== Directions.EAST && arg !== Directions.SOUTH && arg !== Directions.NORTH) {
            console.log("Invalid argument. Possible directions are north, south, east, and west");
            return true;
        }

        /**
         * The player can only go back if the hazard hasn't been conquered.
         */
        if (this.map[curPos.y][curPos.x].hazard) {
            let difX: number = this.player.curPosition.x - this.player.prePosition.x;
            let difY: number = this.player.curPosition.y - this.player.prePosition.y;
            let direc: string;

            if (difX > 0) {
                direc = Directions.WEST;
            }
            else if (difX < 0) {
                direc = Directions.EAST;
            }
            else if (difY > 0) {
                direc = Directions.NORTH;
            }
            else {
                direc = Directions.SOUTH;
            }

            if (arg !== direc) {
                console.log("You can only go " + direc + " before you conquer the hazard!");
                return false;
            }
        }

        if (this.isPlayerOnBorder(arg)) {
            return true;
        }

        this.player.goToDirection(Directions[arg]);
        this.checkGameStatus();

        console.log("DEBUG: position is: " + this.getCurrentArea().position.y + ", " + this.getCurrentArea().position.x);

        console.log(this.getCurrentArea().description());

        if (this.getCurrentArea().position.x === this.monster.position.x
            && this.getCurrentArea().position.y === this.monster.position.y) {
            this.isInformed = true;
        }

        console.log("What would you like to do?");
        return true;
    }

    /**
     * Check whether the user is on the border
     * @param arg user provided argument
     */
    private isPlayerOnBorder(arg: string): boolean {
        if (arg === Directions.WEST && this.player.curPosition.x === 0) {
            console.log("Sorry. You cannot go west!");
            return true;
        }

        if (arg === Directions.EAST && this.player.curPosition.x === MapSize - 1) {
            console.log("Sorry. You cannot go east!");
            return true;
        }

        if (arg === Directions.NORTH && this.player.curPosition.y === 0) {
            console.log("Sorry. You cannot go north!");
            return true;
        }

        if (arg === Directions.SOUTH && this.player.curPosition.y === MapSize - 1) {
            console.log("Sorry. You cannot go south!");
            return true;
        }

        return false;
    }

    private handleLook(arg: string): void {
        arg = arg.toUpperCase();

        if (this.player.hasItem(arg)) {
            this.player.displayItemFunctionality(arg);
        }
        else if (arg === "AREA") {
            let curPos: Pos = this.player.curPosition;
            console.log(this.map[curPos.y][curPos.x].description());
        }
        else {
            console.log("Invalid argument.\nYou could enter an item name to get the detail of the item.");
            console.log("Or you could enter 'Look area' to get the detail of the current area");
        }
    }

    private handleTake(arg: string): void {
        if (this.getCurrentArea().item && arg.toUpperCase() === this.getCurrentArea().item!.name.toUpperCase()) {
            this.player.addItem(this.getCurrentArea().item!);
            this.getCurrentArea().item = undefined;
            console.log("Now you have a " + arg.toLowerCase());
        }
        else if (this.getCurrentArea().treasure && arg.toUpperCase() === "TREASURE") {
            this.player.treasure = this.getCurrentArea().treasure;
            this.getCurrentArea().treasure = undefined;
            console.log("Now you've got the treasure!")
        }
        else {
            console.log("There isn't a " + arg.toLowerCase() + " in this area.");
        }
    }

    private handleUse(arg: string): void {
        arg = arg.toUpperCase();

        if (this.player.hasItem(arg)) {
            if (arg === "SWORD") {
                if(this.player.curPosition.x === this.monster.position.x && this.player.curPosition.y === this.monster.position.y) {
                    this.monster.isDead = true;
                    console.log("You killed the monster");
                }
            } else if (this.getCurrentArea().hazard && this.getCurrentArea().hazard!.item.name.toUpperCase() === arg) {
                this.getCurrentArea().hazard = undefined;
                console.log("You have conquered the hazard.");
            }
            this.player.removeItem(arg);
            console.log(`You have used item ${arg}\n`);
        } else {
            console.log("You don't have such item")
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
        console.log(`DEBUG: checking status: user position ${this.player.curPosition.y} ${this.player.curPosition.x}`);
        console.log(`DEBUG: checking status: monster position ${this.monster.position.y} ${this.monster.position.x}`);
        
        /**
         * When the player is in the same room with the monster, 
         * and the player doesn't have a sword, the player die, the game ends, and return false.
         */
        if (this.player.curPosition.x === this.monster.position.x
            && this.player.curPosition.y === this.monster.position.y
            && !this.player.hasItem("sword")) {
            console.log("There is a monster in front of you. Unfortunately, you don't have a sword.\nYou're killed. Game Over!");
            return false;
        }

        /**
         * When the player is at the exit with treasure, the player wins and the game ends.
         */
        if (this.player.hasTreasure() && this.getCurrentArea().isExit) {
            console.log("Congrats. You Win!");
            return false;
        }

        return true;
    }

    private handleInput(cmd: Command, arg: string): boolean {
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

        if (cmd === Command.QUIT) {
            console.log("Thank you! See you next time.");
            return false;
        }

        /**
         * When the player has been informed that she is in the same room with monster and the player has a sword,
         * if the player didn't use the sword, she'll be killed by the monster and game ends.
         */
        if (this.isInformed && this.player.curPosition.x === this.monster.position.x
            && this.player.curPosition.y === this.monster.position.y
            && (cmd !== Command.USE || arg.toUpperCase() != "SWORD")) {
            console.log("Sorry! You've lost the chance to kill the monster.\nYou've eaten by the monster. Game Over!");
            return false;
        }

        this.monster.goToDirection();
        return this.checkGameStatus();
    }

    private getCurrentArea(): Area {
        let curPos: Pos = this.player.curPosition;
        return this.map[curPos.y][curPos.x];
    }

    start() {
        let prompt: string = this.getCurrentArea().description();
        prompt += "What would you like to do?";
        console.log(prompt);
        this.parser.start();
    }
}