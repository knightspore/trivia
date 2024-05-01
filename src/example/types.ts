import { z } from "zod"
import { Category, Difficulty, QuestionFormat, TriviaQuestion } from "../trivia/types"

export enum EventTypes {
    GameNew = "game-new",
    GameConfigured = "game-configured",
    PlayerReady = "player-ready",
    GameStarted = "game-started",
    GameQuestion = "game-question",
    PlayerAnswer = "player-answer",
    GameDestroyed = "game-destroyed",
}

export type EventType = z.infer<typeof EventType>
export const EventType = z.union([
    z.literal(EventTypes.GameNew),
    z.literal(EventTypes.GameConfigured),
    z.literal(EventTypes.PlayerReady),
    z.literal(EventTypes.GameStarted),
    z.literal(EventTypes.GameQuestion),
    z.literal(EventTypes.PlayerAnswer),
    z.literal(EventTypes.GameDestroyed),
])

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
        questionType: z.nativeEnum(QuestionFormat),
        amount: z.number(),
    }),
})

export type PlayerReadyData = z.infer<typeof PlayerReadyData>
export const PlayerReadyData = z.object({
    game_id: z.string(),
    player_id: z.string(),
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

export type PlayerAnswerData = z.infer<typeof PlayerAnswerData>
export const PlayerAnswerData = z.object({
    game_id: z.string(),
    player_id: z.string(),
    question_id: z.string(),
    answer: z.number(),
})

export type GameDestroyedData = z.infer<typeof GameDestroyedData>
export const GameDestroyedData = z.object({
    game_id: z.string(),
})
