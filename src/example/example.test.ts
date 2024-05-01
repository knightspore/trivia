import { describe, it, expect } from "bun:test"
import { Trivia } from "../trivia"
import { Category, Difficulty, QuestionStyle, type TriviaQuestion } from "../trivia/types"
import { EventLog } from "../event"
import { GameState } from "./core"
import { EventTypes } from "./types"

const game_id = crypto.randomUUID()
const player_id = crypto.randomUUID()

const category = Category.History
const difficulty = Difficulty.Easy
const questionType = QuestionStyle.Multiple
const amount = 10

let trivia: Trivia;
let questions: TriviaQuestion[];
let gameState: GameState;

describe("Trivia", () => {

    it("should initialize", () => {
        trivia = new Trivia(category, difficulty, questionType, amount)
        expect(trivia).toBeInstanceOf(Trivia)
    })

    it("should get questions", async () => {
        questions = await trivia.getQuestions()
        expect(questions).toHaveLength(amount)
    })

})

describe("EventLog", () => {

    it("should initialize", () => {
        gameState = new GameState();
        expect(gameState).toBeInstanceOf(EventLog)
    })

    it("should create and project new game event", () => {
        gameState.push(gameState.newEvent(EventTypes.GameNew, { game_id }, gameState.pos()))
        const [event] = gameState.projector({ type: EventTypes.GameNew })
        expect(event.data.game_id).toBe(game_id)
    })


    it("should create and project config event", () => {
        gameState.push(gameState.newEvent(EventTypes.GameConfigured, {
            game_id,
            config: { category, difficulty, questionType, amount }
        }, gameState.pos()))
        const [event] = gameState.projector({ type: EventTypes.GameConfigured })
        expect(event.data.game_id).toBe(game_id)
        expect(event.data.config.category).toBe(category)
        expect(event.data.config.difficulty).toBe(difficulty)
        expect(event.data.config.questionType).toBe(questionType)
        expect(event.data.config.amount).toBe(amount)
    })

    it("should create and project player ready event", () => {
        gameState.push(gameState.newEvent(EventTypes.PlayerReady, { game_id, player_id }, gameState.pos()))
        const [event] = gameState.projector({ type: EventTypes.PlayerReady })
        expect(event.data.game_id).toBe(game_id)
        expect(event.data.player_id).toBe(player_id)
    })

    it("should create and project start event", () => {
        gameState.push(gameState.newEvent(EventTypes.GameStarted, { game_id }, gameState.pos()))
        const [event] = gameState.projector({ type: EventTypes.GameStarted })
        expect(event.data.game_id).toBe(game_id)
    })

    it("should create and project question event", () => {
        gameState.push(gameState.newEvent(EventTypes.GameQuestion, { game_id, question: questions[0] }, gameState.pos()))
        const [event] = gameState.projector({ type: EventTypes.GameQuestion })
        expect(event.data.game_id).toBe(game_id)
        expect(event.data.question).toBe(questions[0])
    })

    it("should create and project player answer event", () => {
        gameState.push(gameState.newEvent(EventTypes.PlayerAnswer, {
            game_id,
            player_id,
            question_id: questions[0].id,
            answer: 0
        }, gameState.pos()))
        const [event] = gameState.projector({ type: EventTypes.PlayerAnswer })
        expect(event.data.game_id).toBe(game_id)
        expect(event.data.player_id).toBe(player_id)
        expect(event.data.question_id).toBe(questions[0].id)
        expect(event.data.answer).toBe(0)
    })

    it("should create and project destroy event", () => {
        gameState.push(gameState.newEvent(EventTypes.GameDestroyed, { game_id }, gameState.pos()))
        const [event] = gameState.projector({ type: EventTypes.GameDestroyed })
        expect(event.data.game_id).toBe(game_id)
    })

    it.todo("should have set 'id'")

    it.todo("should have set 'started_at'")

    it.todo("should have set 'ended_at'")

    it.todo("should have set 'configured'")

    it.todo("should have set 'ready'")

    it.todo("should have set 'score'")

    it.todo("should have set 'total'")

    it.todo("should have set 'questions'")

})
