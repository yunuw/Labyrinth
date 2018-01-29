import * as readline from 'readline';

/**
 * An enumerated list of command for a simple adventure game.
 */
export enum Command {
  GO = "GO",
  LOOK = "LOOK",
  TAKE = "TAKE",
  USE = "USE",
  INVENTORY = "INVENTORY",
  QUIT = "QUIT"
}

//for easy listing/comparison
const commands = [Command.GO, Command.LOOK, Command.TAKE, Command.USE, Command.INVENTORY, Command.QUIT];

/**
 * A class for handling input commands for a basic adventure game.
 * Acts as a simple wrapper around Node's `readline` module.
 */
export class CommandParser {
  private io: readline.ReadLine;
  private handler: (cmd: Command, arg: string) => boolean;

  /**
   * @param handler A callback function that should handle the user-provided
   * input. The function will be called with the entered Command and argument.
   * The function should return whether or not the parser should prompt the user
   * for further input.
   */
  constructor(handler: (cmd: Command, arg: string) => boolean) {
    this.handler = handler;

    this.io = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      completer: (line: string) => { //adapted from Node docs
        const hits = commands.filter((c) => c.startsWith(line.toUpperCase()));
        return [hits.length ? hits : commands, line];
      }
    });

    this.io.on('line', (line) => {
      let firstSpace = line.indexOf(' ');
      if (firstSpace === -1) firstSpace = line.length;
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
        } else {
          this.io.close();
        }
      }
      else {
        console.log('Invalid command. Commands are:', commands.join(', '));
        this.io.prompt();
      }
    })
  }

  /**
   * @param handler See constructor argument.
   */
  public setHandler(handler: (cmd: Command, arg: string) => boolean) {
    this.handler = handler;
  }

  /**
   * Begin requesting and parsing user input.
   */
  public start() {
    this.io.prompt();
  }
}
