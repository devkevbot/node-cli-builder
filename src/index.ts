import { Cli } from "./cli.ts";

const questions = [
  { id: 1, prompt: "Framework", choices: ["Vanilla", "React", "Vue"] },
  { id: 2, prompt: "TypeScript", choices: ["JavaScript", "TypeScript"] },
  { id: 3, prompt: "CSS Library", choices: ["Vanilla", "Emotion", "Tailwind"] },
];

const cli = new Cli({ questions });

cli.start();
