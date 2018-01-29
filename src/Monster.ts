import { Pos } from './Pos';
import { Direction } from './Constants';

export class Monster {
    // todo make nextStep private
    constructor(public isDead: boolean, public position: Pos, public nextStep: Direction, private mapSize: number) {
    }

    /**
     * The monster will walk to different direction in the followoing order: west, north, east, and south.
     * If the monster cannot go to a certain direction because of the restriction of the map, it will try the next direction.
     */
    public moveToNextPosition(): void {
        //console.log(`DEBUG: monster move: nextStep ${this.nextStep}, x ${this.position.x}, y ${this.position.y}`);
        if (this.nextStep === Direction.WEST) {
            if (this.position.x > 0) {
                this.position.x--;
                this.nextStep = Direction.NORTH;
            }
            else {
                this.nextStep = Direction.NORTH;
                this.moveToNextPosition();
            }
        }
        else if (this.nextStep === Direction.NORTH) {
            if (this.position.y > 0) {
                this.position.y--;
                this.nextStep = Direction.EAST;
            }
            else {
                this.nextStep = Direction.EAST;
                this.moveToNextPosition();
            }
        }
        else if (this.nextStep == Direction.EAST) {
            if (this.position.x < this.mapSize - 1) {
                this.position.x++;
            }
            else {
                this.nextStep = Direction.SOUTH;
                this.moveToNextPosition();
            }
        }
        else if (this.nextStep == Direction.SOUTH) {
            if (this.position.y < this.mapSize - 1) {
                this.position.y++;
            }
            else {
                this.nextStep = Direction.WEST;
                this.moveToNextPosition();
            }
        }
    }
}