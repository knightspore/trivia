
/* Utilities */

import type { Category, Difficulty, QuestionFormat } from "../trivia/types";

async function waitForInput() {
    for await (const line of console) if (line === "") return;
}

function newScreen() {
    console.clear();
}

/* Setup */

const game_id = crypto.randomUUID();
const player_id = crypto.randomUUID();

let category: Category;
let difficulty: Difficulty;
let questionType: QuestionFormat;
let amount: number;

newScreen();
console.log("Welcome to Trivia!");
console.log("Press Enter to begin.");
await waitForInput();

/* Configuration */

newScreen();

