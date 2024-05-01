import { Trivia } from "../trivia";
import { Category, Difficulty, QuestionStyle } from "../trivia/types";
import { GameState } from "./core";

// Utils

async function waitForInput() {
    for await (const line of console) {
        if (line === "")
            return;
    }
}

// Setup

const game_id = crypto.randomUUID()
const player_id = crypto.randomUUID()

const category = Category.History
const difficulty = Difficulty.Easy
const questionType = QuestionStyle.Multiple
const amount = 10

console.clear()
console.log("Initializing Trivia Game...")

const game = new GameState()

game.push(gameNewEvent({ game_id }, pos()));

game.push(gameConfiguredEvent({
    game_id,
    config: { category, difficulty, questionType, amount }
}, pos()))

const triviaData = await new Trivia(category, difficulty, questionType, amount).getQuestions()

// Ready

console.clear()
console.log("Trivia Game is ready to start!");
console.log("Press Enter to start the game...")

await waitForInput()

game.push(playerReadyEvent({
    game_id,
    player_id
}, pos()))

// Game

game.push(gameStartedEvent({ game_id }, pos()))

for (const item of triviaData) {
    console.clear()
    console.log("Question: ", item.question)
    console.log("Choices:")

    item.haystack.forEach((choice, i) => {
        console.log(`${i + 1}. ${choice}`)
    })
    
    game.push(gameQuestionEvent({ game_id, question: item }, pos()))

    let answer: number = -1;
    for await (const line of console) {
        answer = parseInt(line.trim())
        if (isNaN(answer) || 1 > answer || answer > 4) {
            console.log("Please enter a valid choice")
            answer = -1
            continue
        } else {
            game.push(playerAnswerEvent({
                game_id,
                player_id,
                question_id: item.id,
                answer: answer - 1,
            }, pos()))
            break;
        }
    }

}

game.push(gameDestroyedEvent({ game_id }, pos()))

console.clear();
console.log("Game Over!")
console.log("Press Enter to generate scores...")

await waitForInput()

console.clear()

// Display scoreboard and save game state

const projection = gameStateProjector(log)
const gameStateProjection = JSON.stringify(projection, null, 2)
const gameEvents = JSON.stringify(log, null, 2)

const game = Bun.file("gameStateProjection.json")
const writer = game.writer()
writer.write(gameStateProjection)
writer.end()

const events = Bun.file("gameEvents.json")
const writer2 = events.writer()
writer2.write(gameEvents)
writer2.end()

console.log("Game Results:")
console.table(gameStateProjection)

