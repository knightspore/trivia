import { ServerWebSocket } from "bun";
import { TriviaAPI, TriviaCategory } from "./constants";
import {getOrCreatePlayer} from "./player";

let CURRENT_ROUND: Generator<any, any, any>;

const tdb = await new TriviaAPI()
  .amount(10)
  .category(TriviaCategory.Animals)
  .difficulty("easy")
  .type("multiple")
  .get();

Bun.serve({
  port: 3000,
  fetch(req, server) {
    if (server.upgrade(req)) {
      return; // do not return response for ws
    }
  },
  websocket: {
    perMessageDeflate: true,
    async message(ws: ServerWebSocket, message: string | Buffer) {
      await handleMessage(ws, message);
    },
    open(ws: ServerWebSocket) {
      console.log(`> ${getOrCreatePlayer(ws).id} Connected`);
    },
    close(ws: ServerWebSocket, code: number, message: string) {
      console.log(
        `> ${getOrCreatePlayer(ws).id} Closed (${code}) - [${message}]`
      );
    },
    drain(ws: ServerWebSocket) {
      console.log(ws);
    },
  },
});

async function handleMessage(ws: ServerWebSocket, message: string | Buffer) {
  switch (message) {
    case "STARTGAME":
      CURRENT_ROUND = tdb.startRound();
      sendQuestion(ws);
      break;
    case "NEXTQUESTION":
      sendQuestion(ws);
      break;
  }
}

async function sendQuestion(ws: ServerWebSocket) {

  const { value, done } = CURRENT_ROUND.next();

  if (!done) {

    const { correctAnswer, scrambledAnswers } = scrambleAnswers(
      value.incorrect_answers,
      value.correct_answer
    );

    console.log(`Q: ${value.question}`);
    console.log(`A: ${scrambledAnswers[correctAnswer]}`);

    ws.send(`${value.question}`);

    let alph = alphabetize();

    for (const option of scrambledAnswers) {
      let multipleChoiceOption = `> ${alph.next().value}. ${option}`;
      console.log(multipleChoiceOption);
      ws.send(multipleChoiceOption);
    }

  } else {

    ws.send("End of round");

  }
}

function scrambleAnswers(
  incorrect_answers: Array<string>,
  correct_answer: string
): { correctAnswer: number; scrambledAnswers: Array<string> } {
  let scrambledAnswers = [...incorrect_answers, correct_answer]
    .map((v) => ({ v, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ v }) => v);
  let correctAnswer = scrambledAnswers.indexOf(correct_answer);
  return { correctAnswer, scrambledAnswers };
}

const alphabetize = function* () {
  yield "A";
  yield "B";
  yield "C";
  yield "D";
};
