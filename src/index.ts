import { ServerWebSocket } from "bun";
import { Msg } from "./game/message";
import { Player, createPlayer } from "./game/player";
import { BASE_URL, Category, Param, addParam, getQuestions } from "./game/trivia";
import { closeHandler } from "./handler/close-handler";
import { drainHandler } from "./handler/drain-handler";
import { messageHandler } from "./handler/message-handler";
import { openHandler } from "./handler/open-handler";
import { createServerConfig } from "./server/websocket-server";
import { alphabetize, delay, scramble } from "./utils";

// 1. Initialize Database

export const PLAYERS: Record<string, Player> = {}

export function getOrCreatePlayer(name: string) {
    if (!PLAYERS[name]) {
        PLAYERS[name] = createPlayer(name);
    }
    return PLAYERS[name]
}

export const MESSAGES: Record<string, Msg> = {}

// 2. Get Questions

export const API_URL = BASE_URL;

addParam<Param.Amount>(API_URL, Param.Amount, 10)
addParam<Param.Category>(API_URL, Param.Category, Category.Film)
addParam<Param.Difficulty>(API_URL, Param.Difficulty, "easy")
addParam<Param.QuestionType>(API_URL, Param.QuestionType, "multiple")

export const questions = await getQuestions(API_URL);

// TEMP: Game Logic

export async function startGame(ws: ServerWebSocket) {
    if (questions != null) {
        let i = 1
        for (const question of questions) {
            let message = ""
            message += `${i}. ${question.question.toString()}\n\n`
            const { scrambled } = scramble(question.incorrect_answers, question.correct_answer)
            const alph = alphabetize();
            for (const answer of scrambled) {
                let { value } = alph.next()
                message += `\t ${value}. ${answer}\n`
            }
            ws.send(message)
            await delay(60000)
            ws.send(`\n\nAnswer: ${question.correct_answer}\n\n`)
            i++;
        }
    }
}

// 3. Start Server

const serverConfig = createServerConfig({
    port: 3000,
    onMessage: messageHandler,
    onOpen: openHandler,
    onClose: closeHandler,
    onDrain: drainHandler,
})

Bun.serve(serverConfig);

// 4. Wait for Start
