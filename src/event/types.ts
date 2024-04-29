import { z } from "zod"
import { Category, Difficulty, QuestionStyle, TriviaQuestion } from "../trivia/types"

export enum EventTypes {
    // Setup
    GameNew = "game-new",
    GameConfigured = "game-configured",
    PlayerReady = "player-ready",

    // Game events
    GameStarted = "game-started",
    GameQuestion = "game-question",
    PlayerAnswer = "player-answer",
    GameQuestionEnded = "game-question-ended",
    GameEnded = "game-ended",

    // Teardown
    GameScoreboard = "game-scoreboard",
    GameDestroyed = "game-destroyed",
}

export type EventType = z.infer<typeof EventType>
export const EventType = z.union([
    // Setup
    z.literal(EventTypes.GameNew),
    z.literal(EventTypes.GameConfigured),
    z.literal(EventTypes.PlayerReady),

    // Game events
    z.literal(EventTypes.GameStarted),
    z.literal(EventTypes.GameQuestion),
    z.literal(EventTypes.PlayerAnswer),
    z.literal(EventTypes.GameQuestionEnded),
    z.literal(EventTypes.GameEnded),

    // Teardown
    z.literal(EventTypes.GameScoreboard),
    z.literal(EventTypes.GameDestroyed),
])

export type Event = z.infer<typeof Event>
export const Event = z.object({
    type: EventType,
    data: z.any(),
    position: z.number(),
}).transform((msg) => {
    return {
        id: crypto.randomUUID(),
        date: new Date().toString(),
        ...msg,
    }
})

export type EventLog = z.infer<typeof Event>[]

export type PlayerReadyData = z.infer<typeof PlayerReadyData>
export const PlayerReadyData = z.object({
    game_id: z.string(),
    player_id: z.string(),
})

export type PlayerAnswerData = z.infer<typeof PlayerAnswerData>
export const PlayerAnswerData = z.object({
    game_id: z.string(),
    player_id: z.string(),
    question_id: z.string(),
    answer: z.number(),
})

export type GameNewData = z.infer<typeof GameNewData>
export const GameNewData = z.object({
    game_id: z.string(),
})

export type GameConfiguredData = z.infer<typeof GameConfiguredData>
export const GameConfiguredData = z.object({
    game_id: z.string(),
    config: z.object({
        category: z.nativeEnum(Category),
        difficulty: z.nativeEnum(Difficulty),
        questionType: z.nativeEnum(QuestionStyle),
        amount: z.number(),
    }),
})

export type GameStartedData = z.infer<typeof GameStartedData>
export const GameStartedData = z.object({
    game_id: z.string(),
})

export type GameQuestionData = z.infer<typeof GameQuestionData>
export const GameQuestionData = z.object({
    game_id: z.string(),
    question: TriviaQuestion,
})

export type GameQuestionEndedData = z.infer<typeof GameQuestionEndedData>
export const GameQuestionEndedData = z.object({
    game_id: z.string(),
    question_id: z.string(),
})

export type GameScoreboardData = z.infer<typeof GameScoreboardData>
export const GameScoreboardData = z.object({
    game_id: z.string(),
    scores: z.array(z.object({
        player_id: z.string(),
        score: z.number(),
        total: z.number(),
    })),
})

export type GameDestroyedData = z.infer<typeof GameDestroyedData>
export const GameDestroyedData = z.object({
    game_id: z.string(),
})
