import { describe, it, expect } from "bun:test"
import { Trivia } from "../trivia"
import { Category, Difficulty, QuestionFormat, type TriviaQuestion } from "../trivia/types"
import { EventLog } from "../event"
import { GameState } from "./core"
import { EventTypes } from "./types"

const game_id = crypto.randomUUID()
const player_id = crypto.randomUUID()

const category = Category.History
const difficulty = Difficulty.Easy
const questionType = QuestionFormat.Multiple
const amount = 10

let trivia: Trivia;
let questions: TriviaQuestion[];
let game: GameState;

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
        game = new GameState();

        expect(game).toBeInstanceOf(GameState)
        expect(game).toBeInstanceOf(EventLog)
    })

    it("should create and project new game event", () => {
        game.push(game.create(EventTypes.GameNew, { game_id }))

        const [event] = game.project({ type: EventTypes.GameNew })

        expect(event.data.game_id).toBe(game_id)
    })


    it("should create and project config event", () => {
        game.push(game.create(EventTypes.GameConfigured, {
            game_id,
            config: { category, difficulty, questionType, amount }
        }))

        const [event] = game.project({ type: EventTypes.GameConfigured })

        expect(event.data.game_id).toBe(game_id)
        expect(event.data.config.category).toBe(category)
        expect(event.data.config.difficulty).toBe(difficulty)
        expect(event.data.config.questionType).toBe(questionType)
        expect(event.data.config.amount).toBe(amount)
    })

    it("should create and project player ready event", () => {
        game.push(game.create(EventTypes.PlayerReady, { game_id, player_id }))

        const [event] = game.project({ type: EventTypes.PlayerReady })

        expect(event.data.game_id).toBe(game_id)
        expect(event.data.player_id).toBe(player_id)
    })

    it("should create and project start event", () => {
        game.push(game.create(EventTypes.GameStarted, { game_id }))

        const [event] = game.project({ type: EventTypes.GameStarted })

        expect(event.data.game_id).toBe(game_id)
    })

    it("should create and project question event", () => {
        game.push(game.create(EventTypes.GameQuestion, { game_id, question: questions[0] }))

        const [event] = game.project({ type: EventTypes.GameQuestion })

        expect(event.data.game_id).toBe(game_id)
        expect(event.data.question).toBe(questions[0])
    })

    it("should create and project player answer event", () => {
        game.push(game.create(EventTypes.PlayerAnswer, {
            game_id,
            player_id,
            question_id: questions[0].id,
            answer: questions[0].needle
        }))

        const [event] = game.project({ type: EventTypes.PlayerAnswer })

        expect(event.data.game_id).toBe(game_id)
        expect(event.data.player_id).toBe(player_id)
        expect(event.data.question_id).toBe(questions[0].id)
        expect(event.data.answer).toBe(questions[0].needle)
    })

    it("should create and project destroy event", () => {
        game.push(game.create(EventTypes.GameDestroyed, { game_id }))

        const [event] = game.project({ type: EventTypes.GameDestroyed })

        expect(event.data.game_id).toBe(game_id)
    })

    it("should hydrate game state with values", () => {
        game.hydrate()

        expect(game.id).toBe(game_id)
        expect(game.started_at).toBeDefined()
        expect(game.ended_at).toBeDefined()
        if (game.ended_at) {
            expect(game.started_at).toBeLessThanOrEqual(game.ended_at)
        }

        expect(game.configured).toBeDefined()
        expect(game.configured!.config.category).toBe(category)
        expect(game.configured!.config.difficulty).toBe(difficulty)
        expect(game.configured!.config.questionType).toBe(questionType)
        expect(game.configured!.config.amount).toBe(amount)

        expect(game.ready).toBeDefined()
        expect(game.score).toBe(1)
        expect(game.total).toBe(1)
        expect(game.questions).toHaveLength(1)

        expect(game.lastHydrated).toBeDefined()
        expect(game.lastHydrated).toBe(6)
    })

})
