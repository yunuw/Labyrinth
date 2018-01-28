import { Item } from './Item';
import { Hazard } from './Hazard';
import { Pos } from './Pos';
import { Treasure } from './Treasure';
import { Area } from './Area';
import { Player } from './Player';
import { Game } from './Game';
import { MapSize, Directions } from './Constants';

let str: string[] = [];
str.push("abc");
str.push("efg");
let s: string = "abc";
let index: number = str.indexOf(s);
str.splice(index, 1);

console.log(str[0]);
