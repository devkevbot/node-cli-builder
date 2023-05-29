import * as readline from "node:readline";
import { stdin, stdout } from "node:process";

type Question = {
  id: number;
  prompt: string;
  choices: string[];
};

type CliConstructor = {
  questions: Question[];
};

export class Cli {
  #input;
  #output;
  #highlightSymbol;
  #state;

  constructor({ questions }: CliConstructor) {
    this.#input = stdin;
    this.#output = stdout;
    this.#highlightSymbol = "*";
    this.#state = {
      currQuestionIdx: 0,
      currChoiceIdx: 0,
      questions,
    };
  }

  start() {
    readline.emitKeypressEvents(this.#input);
    if (this.#input.isTTY) {
      this.#input.setRawMode(true);
    }
    this.#input.resume();
    this.#input.on("keypress", (_, key) => this.#onKeyPress(key));

    this.#renderQuestion();
  }

  #stop() {
    if (this.#input.isTTY) {
      this.#input.setRawMode(false);
    }
    this.#input.pause();
  }

  #onKeyPress(key: { name: string; ctrl: boolean }) {
    if (!key) return;

    const currQuestion = this.#state.questions[this.#state.currQuestionIdx];
    const minIdx = 0;
    const maxIdx = currQuestion.choices.length - 1;

    if (key.name === "down" && this.#state.currChoiceIdx < maxIdx) {
      this.#state.currChoiceIdx += 1;
      this.#renderQuestion();
    } else if (key.name === "up" && this.#state.currChoiceIdx > minIdx) {
      this.#state.currChoiceIdx -= 1;
      this.#renderQuestion();
    } else if (key.name === "esc" || (key.ctrl && key.name === "c")) {
      this.#stop();
    } else if (key.name === "return") {
      this.#output.write(
        `You selected: ${currQuestion.choices[this.#state.currChoiceIdx]}\n`
      );
      if (this.#state.currQuestionIdx === this.#state.questions.length - 1) {
        this.#output.write("All done!");
        this.#stop();
      } else {
        this.#state.currQuestionIdx++;
        this.#state.currChoiceIdx = 0;
        this.#renderQuestion();
      }
    }
  }

  /**
   * Renders the prompt for the current question.
   */
  #renderPrompt() {
    const { prompt } = this.#state.questions[this.#state.currQuestionIdx];
    const borderBox = "=".repeat(prompt.length);
    this.#output.write(`${borderBox}\n`);
    this.#output.write(`${prompt}\n`);
    this.#output.write(`${borderBox}\n`);
  }

  /**
   * Renders the list of choices for the current question.
   */
  #renderChoices() {
    const { choices } = this.#state.questions[this.#state.currQuestionIdx];
    choices.forEach((option, i) => {
      if (this.#state.currChoiceIdx === i) {
        this.#output.write(`${this.#highlightSymbol} ${option}\n`);
      } else {
        this.#output.write(`${option}\n`);
      }
    });
  }

  /**
   * Renders the current questions. Users can then interact with the displayed choices.
   */
  #renderQuestion() {
    // This function call assumes that the writable stream is STDOUT
    console.clear();
    this.#renderPrompt();
    this.#renderChoices();
  }
}
