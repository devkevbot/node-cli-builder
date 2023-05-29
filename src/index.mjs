import * as readline from "node:readline";
import { exit, stdin, stdout } from "node:process";

class Cli {
  constructor({ options }) {
    this.input = stdin;
    this.output = stdout;
    this.highlightSymbol = "*";
    this.state = {
      index: 0,
      options,
    };
  }

  start() {
    readline.emitKeypressEvents(this.input);
    if (this.input.isTTY) {
      this.input.setRawMode(true);
    }
    this.input.resume();
    this.input.on("keypress", (...args) => this.onKeyPress(...args));

    this.renderOptionMenu();
  }

  stop() {
    if (this.input.isTTY) {
      this.input.setRawMode(false);
    }
    this.input.pause();
    exit(0);
  }

  onKeyPress(_, key) {
    if (!key) return;

    const minIndex = 0;
    const maxIndex = this.state.options.length - 1;

    if (key.name === "down" && this.state.index < maxIndex) {
      this.state.index += 1;
      this.renderOptionMenu();
    } else if (key.name === "up" && this.state.index > minIndex) {
      this.state.index -= 1;
      this.renderOptionMenu();
    } else if (key.name === "esc" || (key.ctrl && key.name === "c")) {
      this.stop();
    } else if (key.name === "return") {
      this.output.write(
        `You selected: ${this.state.options[this.state.index]}`
      );
      this.stop();
    }
  }

  renderOptionMenu() {
    // This function call assumes that the writable stream is STDOUT
    console.clear();

    this.output.write("Select an option:\n");

    this.state.options.forEach((option, i) => {
      if (this.state.index === i) {
        this.output.write(`${this.highlightSymbol} ${option}\n`);
      } else {
        this.output.write(`${option}\n`);
      }
    });
  }
}

const cli = new Cli({ options: ["foo", "bar", "baz"] });

cli.start();
