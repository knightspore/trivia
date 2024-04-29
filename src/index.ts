import { Trivia } from "./trivia";
import { Category, Difficulty, QuestionStyle, TriviaQuestion } from "./trivia/types";
import { EventTypes, type Event } from "./event";
import { gameConfiguredEvent, gameNewEvent, gameQuestionEndedEvent, gameQuestionEvent, gameStartedEvent } from "./event/game-event";
import { PlayerAnswerData, playerAnswerEvent, playerReadyEvent } from "./event/player-event";

interface IGameState {
    id: string;
    position: number;
    ready: boolean;
    running: boolean;
    score: number;
    total: number;
    events: Event[];
    questions: TriviaQuestion[];
    trivia: Trivia;
}

interface IGameControls {
    log: (e: Event) => void;
    printEvent: (e: Event) => void;
    hydrate: () => void;
}

let g: IGameState & IGameControls = {
    id: crypto.randomUUID(),
    position: -1,
    ready: false,
    running: false,
    score: 0,
    total: 0,
    events: [],
    questions: [],
    trivia: new Trivia(Category.Film, Difficulty.Easy, QuestionStyle.Multiple, 10),
    log(e: Event) {
        this.events.push(e)
    },
    printEvent(e: Event) {
        process.stdout.write(`\n// ---[${e.type}]\n`)
        process.stdout.write(`| - id: ${e.id}\n`)
        process.stdout.write(`| - pos: ${e.position}\n`)
        process.stdout.write(`| - date: ${e.date}\n`)
        process.stdout.write(`| - data: ${Object.keys(e.data).join(", ")}\n`)
        process.stdout.write(`\\\\---[${e.type}]\n`)
    },
    hydrate() {
        for (const event of this.events) {
            if (this.position < event.position) {
                this.position = event.position
                switch (event.type) {
                    case EventTypes.GameNew:
                        this.running = true;
                        break;
                    case EventTypes.PlayerReady:
                        this.ready = true;
                        break;
                    case EventTypes.GameStarted:
                        this.score = 0;
                        break;
                    case EventTypes.GameQuestion:
                        this.total++;
                        break;
                    case EventTypes.PlayerAnswer:
                        const { answer, question_id }: PlayerAnswerData = event.data
                        const question = this.questions.find(q => q.id === question_id)
                        if (answer == question?.needle) {
                            this.score++;
                        }
                        break;
                    case EventTypes.GameQuestionEnded:
                        break;
                }
            }
        }
    }
}

// Start the Game

console.clear()
console.log("Initializing Trivia Game...")

const game_id = crypto.randomUUID()
const player_id = crypto.randomUUID()

g.events.push(gameNewEvent({ game_id: g.id }))

g.log(gameConfiguredEvent({
    game_id: g.id,
    config: {
        category: g.trivia.category,
        difficulty: g.trivia.difficulty,
        questionType: g.trivia.questionType,
        amount: g.trivia.amount,
    }
}))

g.questions = await g.trivia.getQuestions()

console.clear()
console.log("Trivia Game is ready to start!");
console.log("Press Enter to start the game...")

for await (const line of console) {
    if (line === "")
        break;
}

g.log(playerReadyEvent({ game_id, player_id }))
g.log(gameStartedEvent({ game_id }))

for (const q of g.questions) {
    console.clear()
    console.log("Question: ", q.question)
    console.log("Choices:")
    q.haystack.forEach((choice, i) => {
        console.log(`${i + 1}. ${choice}`)
    })

    g.log(gameQuestionEvent({ game_id, question: q }))

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

    g.log(playerAnswerEvent({
        game_id,
        player_id,
        question_id: q.id,
        answer: answer - 1,
    }))

    g.log(gameQuestionEndedEvent({ game_id, question_id: q.id }))
}

console.clear();
console.log("Game Over!")
console.log("Generating scores...")

g.hydrate()

console.clear()
console.log(`Your Score: ${g.score}/${g.total}`)

for await (const line of console) {
    if (line === "")
        break;
}

// Print all events 
console.clear()

g.events.forEach((e) => {
    g.printEvent(e)
})
