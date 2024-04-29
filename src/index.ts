import { Trivia } from "./trivia";
import { Category, Difficulty, QuestionStyle, TriviaQuestion } from "./trivia/types";
import { EventTypes, Event, PlayerAnswerData } from "./event/types";
import { gameConfiguredEvent, gameNewEvent, gameQuestionEndedEvent, gameQuestionEvent, gameStartedEvent, newEventLog, playerAnswerEvent, playerReadyEvent, printEvent } from "./event";

// Setup

const game_id = crypto.randomUUID()
const player_id = crypto.randomUUID()

console.clear()
console.log("Initializing Trivia Game...")

const { log, push, pos } = newEventLog()

push(gameNewEvent({ game_id }, pos()));

push(gameConfiguredEvent({
    game_id: "1",
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

    push(gameQuestionEndedEvent({ game_id, question_id: q.id }, pos()))
}

console.clear();
console.log("Game Over!")
console.log("Generating scores...")

// TODO: Hydrate / Project


console.clear()
console.log(`Your Score: ${0}/${0}`)

for await (const line of console) {
    if (line === "")
        log.forEach(e => console.log(printEvent(e)))
        process.exit(0)
}

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

let g: IGameState & any = {
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
        printEvent(e)
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

