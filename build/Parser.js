"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const readline = require("readline");
/**
 * An enumerated list of command for a simple adventure game.
 */
var Command;
(function (Command) {
    Command["GO"] = "GO";
    Command["LOOK"] = "LOOK";
    Command["TAKE"] = "TAKE";
    Command["USE"] = "USE";
    Command["INVENTORY"] = "INVENTORY";
    Command["QUIT"] = "QUIT";
})(Command = exports.Command || (exports.Command = {}));
//for easy listing/comparison
const commands = [Command.GO, Command.LOOK, Command.TAKE, Command.USE, Command.INVENTORY, Command.QUIT];
/**
 * A class for handling input commands for a basic adventure game.
 * Acts as a simple wrapper around Node's `readline` module.
 */
class CommandParser {
    /**
     * @param handler A callback function that should handle the user-provided
     * input. The function will be called with the entered Command and argument.
     * The function should return whether or not the parser should prompt the user
     * for further input.
     */
    constructor(handler) {
        this.handler = handler;
        this.io = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
            completer: (line) => {
                const hits = commands.filter((c) => c.startsWith(line.toUpperCase()));
                return [hits.length ? hits : commands, line];
            }
        });
        this.io.on('line', (line) => {
            let firstSpace = line.indexOf(' ');
            if (firstSpace === -1)
                firstSpace = line.length;
            let cmd = line.substr(0, firstSpace).toUpperCase();
            if (cmd === Command.QUIT) {
                console.log(`Thank you! See you next time.`);
                this.io.close();
            }
            else if (Command[cmd]) {
                let arg = line.substr(firstSpace + 1);
                let shouldProceed = this.handler(cmd, arg); //call handler function!
                if (shouldProceed) {
                    this.io.prompt();
                }
                else {
                    this.io.close();
                }
            }
            else {
                console.log('Invalid command. Commands are:', commands.join(', '));
                this.io.prompt();
            }
        });
    }
    /**
     * @param handler See constructor argument.
     */
    setHandler(handler) {
        this.handler = handler;
    }
    /**
     * Begin requesting and parsing user input.
     */
    start() {
        this.io.prompt();
    }
}
exports.CommandParser = CommandParser;
//# sourceMappingURL=Parser.js.map