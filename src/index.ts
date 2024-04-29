import { Trivia } from "./trivia";
import { Category, Difficulty, QuestionStyle} from "./trivia/types";
import { gameConfiguredEvent, gameDestroyedEvent, gameNewEvent, gameQuestionEvent, gameStartedEvent, newEventLog, playerAnswerEvent, playerReadyEvent, printEvent } from "./event";
import { gameStateProjector } from "./event/projector";

// Setup

const game_id = crypto.randomUUID()
const player_id = crypto.randomUUID()

console.clear()
console.log("Initializing Trivia Game...")

const { log, push, pos } = newEventLog()

push(gameNewEvent({ game_id }, pos()));

push(gameConfiguredEvent({
    game_id,
    config: {
        category: Category.Film,
        difficulty: Difficulty.Easy,
        questionType: QuestionStyle.Multiple,
        amount: 10,
    }
}, pos()))

const questions = await new Trivia(Category.Film, Difficulty.Easy, QuestionStyle.Multiple, 10).getQuestions()

// Ready

console.clear()
console.log("Trivia Game is ready to start!");
console.log("Press Enter to start the game...")
for await (const line of console) {
    if (line === "")
        break;
}

push(playerReadyEvent({
    game_id,
    player_id
}, pos()))

// Game

push(gameStartedEvent({ game_id }, pos()))

for (const q of questions) {
    console.clear()
    console.log("Question: ", q.question)
    console.log("Choices:")
    q.haystack.forEach((choice, i) => {
        console.log(`${i + 1}. ${choice}`)
    })

    push(gameQuestionEvent({ game_id, question: q }, pos()))

    let answer: number = q.question.length + 1;
    for await (const line of console) {
        answer = parseInt(line.trim())
        if (isNaN(answer) || answer < 1 || answer > q.haystack.length) {
            console.log("Please enter a valid choice")
            answer = q.question.length + 1
            continue
        } else {
            break
        }
    }

    push(playerAnswerEvent({
        game_id,
        player_id,
        question_id: q.id,
        answer: answer - 1,
    }, pos()))
}

push(gameDestroyedEvent({ game_id }, pos()))

console.clear();
console.log("Game Over!")
console.log("Generating scores...")



console.clear()
// TODO: Hydrate / Project
const gameStateProjection = JSON.stringify(gameStateProjector(log), null, 2)
const gameEvents = JSON.stringify(log, null, 2)

const game = Bun.file("gameStateProjection.json")
const writer = game.writer()
writer.write(gameStateProjection)
writer.end()

const events = Bun.file("gameEvents.json")
const writer2 = events.writer()
writer2.write(gameEvents)
writer2.end()

