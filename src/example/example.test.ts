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
        expect(gameState.log).toHaveLength(0)
        expect(gameState.pos()).toBe(0)
    })

    it("gameNewEvent", () => {
        gameState.push(gameState.newEvent(EventTypes.GameNew, { game_id }, gameState.pos()))
        expect(gameState.log).toHaveLength(1)
        expect(gameState.pos()).toBe(1)
    })

    it("gameNewProjector", () => {
        const events = gameState.gameNewProjector()
        expect(events[0].data.game_id).toBe(game_id)
    })

    it("gameConfiguredEvent", () => {
        gameState.push(gameState.newEvent(EventTypes.GameConfigured, {
            game_id,
            config: { category, difficulty, questionType, amount }
        }, gameState.pos()))
        expect(gameState.log).toHaveLength(2)
        expect(gameState.pos()).toBe(2)
    })

    it("gameConfiguredProjector", () => {
        const events = gameState.gameConfiguredProjector()
        expect(events[0].data.game_id).toBe(game_id)
        expect(events[0].data.config.category).toBe(category)
        expect(events[0].data.config.difficulty).toBe(difficulty)
        expect(events[0].data.config.questionType).toBe(questionType)
        expect(events[0].data.config.amount).toBe(amount)
    })

    it("playerReadyEvent", () => {
        gameState.push(gameState.newEvent(EventTypes.PlayerReady, { game_id, player_id }, gameState.pos()))
        expect(gameState.log).toHaveLength(3)
        expect(gameState.pos()).toBe(3)
    })

    it("playerReadyProjector", () => {
        const events = gameState.playerReadyProjector()
        expect(events[0].data.game_id).toBe(game_id)
        expect(events[0].data.player_id).toBe(player_id)
    })

    it("gameStartedEvent", () => {
        gameState.push(gameState.newEvent(EventTypes.GameStarted, { game_id }, gameState.pos()))
        expect(gameState.log).toHaveLength(4)
        expect(gameState.pos()).toBe(4)
    })

    it("gameStartedProjector", () => {
        const events = gameState.gameStartedProjector()
        expect(events[0].data.game_id).toBe(game_id)
    })

    it("gameQuestionEvent", () => {
        gameState.push(gameState.newEvent(EventTypes.GameQuestion, { game_id, question: questions[0] }, gameState.pos()))
        expect(gameState.log).toHaveLength(5)
        expect(gameState.pos()).toBe(5)
    })

    it("gameQuestionProjector", () => {
        const events = gameState.gameQuestionProjector()
        expect(events[0].data.game_id).toBe(game_id)
        expect(events[0].data.question).toBe(questions[0])
    })

    it("playerAnswerEvent", () => {
        gameState.push(gameState.newEvent(EventTypes.PlayerAnswer, {
            game_id,
            player_id,
            question_id: questions[0].id,
            answer: 0
        }, gameState.pos()))
        expect(gameState.log).toHaveLength(6)
        expect(gameState.pos()).toBe(6)
    })

    it("playerAnswerProjector", () => {
        const events = gameState.playerAnswerProjector()
        expect(events[0].data.game_id).toBe(game_id)
        expect(events[0].data.player_id).toBe(player_id)
        expect(events[0].data.question_id).toBe(questions[0].id)
        expect(events[0].data.answer).toBe(0)
    })

    it("gameDestroyedEvent", () => {
        gameState.push(gameState.newEvent(EventTypes.GameDestroyed, { game_id }, gameState.pos()))
        expect(gameState.log).toHaveLength(7)
        expect(gameState.pos()).toBe(7)
    })

})
