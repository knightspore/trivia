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

describe("GameState", () => {

    it("should initialize", () => {
        gameState = new GameState();

        expect(gameState).toBeInstanceOf(GameState)
        expect(gameState).toBeInstanceOf(EventLog)
    })

    it("should create and project new game event", () => {
        gameState.push(gameState.newEvent(EventTypes.GameNew, { game_id }))

        const [event] = gameState.projector({ type: EventTypes.GameNew })

        expect(event.data.game_id).toBe(game_id)
    })


    it("should create and project config event", () => {
        gameState.push(gameState.newEvent(EventTypes.GameConfigured, {
            game_id,
            config: { category, difficulty, questionType, amount }
        }))

        const [event] = gameState.projector({ type: EventTypes.GameConfigured })

        expect(event.data.game_id).toBe(game_id)
        expect(event.data.config.category).toBe(category)
        expect(event.data.config.difficulty).toBe(difficulty)
        expect(event.data.config.questionType).toBe(questionType)
        expect(event.data.config.amount).toBe(amount)
    })

    it("should create and project player ready event", () => {
        gameState.push(gameState.newEvent(EventTypes.PlayerReady, { game_id, player_id }))

        const [event] = gameState.projector({ type: EventTypes.PlayerReady })

        expect(event.data.game_id).toBe(game_id)
        expect(event.data.player_id).toBe(player_id)
    })

    it("should create and project start event", () => {
        gameState.push(gameState.newEvent(EventTypes.GameStarted, { game_id }))

        const [event] = gameState.projector({ type: EventTypes.GameStarted })

        expect(event.data.game_id).toBe(game_id)
    })

    it("should create and project question event", () => {
        gameState.push(gameState.newEvent(EventTypes.GameQuestion, { game_id, question: questions[0] }))

        const [event] = gameState.projector({ type: EventTypes.GameQuestion })

        expect(event.data.game_id).toBe(game_id)
        expect(event.data.question).toBe(questions[0])
    })

    it("should create and project player answer event", () => {
        gameState.push(gameState.newEvent(EventTypes.PlayerAnswer, {
            game_id,
            player_id,
            question_id: questions[0].id,
            answer: questions[0].needle
        }))

        const [event] = gameState.projector({ type: EventTypes.PlayerAnswer })

        expect(event.data.game_id).toBe(game_id)
        expect(event.data.player_id).toBe(player_id)
        expect(event.data.question_id).toBe(questions[0].id)
        expect(event.data.answer).toBe(questions[0].needle)
    })

    it("should create and project destroy event", () => {
        gameState.push(gameState.newEvent(EventTypes.GameDestroyed, { game_id }))

        const [event] = gameState.projector({ type: EventTypes.GameDestroyed })

        expect(event.data.game_id).toBe(game_id)
    })

    it("should hydrate game state with values", () => {
        gameState.hydrate()

        expect(gameState.id).toBe(game_id)
        expect(gameState.started_at).toBeDefined()
        expect(gameState.ended_at).toBeDefined()
        if (gameState.ended_at) {
            expect(gameState.started_at).toBeLessThanOrEqual(gameState.ended_at)
        }

        expect(gameState.configured).toBeDefined()
        expect(gameState.configured!.config.category).toBe(category)
        expect(gameState.configured!.config.difficulty).toBe(difficulty)
        expect(gameState.configured!.config.questionType).toBe(questionType)
        expect(gameState.configured!.config.amount).toBe(amount)

        expect(gameState.ready).toBeDefined()
        expect(gameState.score).toBe(1)
        expect(gameState.total).toBe(1)
        expect(gameState.questions).toHaveLength(1)

        expect(gameState.lastHydrated).toBeDefined()
        expect(gameState.lastHydrated).toBe(6)
    })

})
