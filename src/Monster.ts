import { Pos } from './Pos';
import { MapSize, Directions } from './Constants';

export class Monster{
    position: Pos;
    isDead: boolean;
    nextStep: Directions;

    constructor(position: Pos, isDead: boolean, nextStep: Directions){
        this.position = position;
        this.isDead = isDead;
        this.nextStep = nextStep;
    }

    public goToDirection(): void{
        if(this.nextStep === Directions.WEST){
            if(this.position.x > 0){
                this.position.x--;
                this.nextStep = Directions.NORTH;
            }
            else{
                this.nextStep = Directions.NORTH;
                this.goToDirection();
            }
        }
        else if(this.nextStep === Directions.NORTH){
            if(this.position.y > 0){
                this.position.y--;
                this.nextStep = Directions.EAST;
            }
            else{
                this.nextStep = Directions.EAST;
                this.goToDirection();
            }
        }
        else if(this.nextStep == Directions.EAST){
            if(this.position.x < MapSize - 1){
                this.position.x++;
            }
            else{
                this.nextStep = Directions.SOUTH;
                this.goToDirection();
            }
        }
        else if(this.nextStep == Directions.SOUTH){
            if(this.position.y < MapSize - 1){
                this.position.y++;
            }
            else{
                this.nextStep = Directions.WEST;
                this.goToDirection();
            }
        }
    }
}