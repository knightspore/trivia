import { Trivia } from "./trivia";

const t = new Trivia();

const questions = await t.getQuestions();

console.log(questions);
