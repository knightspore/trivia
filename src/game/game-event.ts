import { z } from "zod"
import { EventTypes, newEvent } from "./event"
import { Category, Difficulty, QuestionStyle, TriviaQuestion } from "../trivia/types"

export type GameNewData = z.infer<typeof GameNewData>
export const GameNewData = z.object({
    game_id: z.string(),
})


export function gameNewEvent(data: GameNewData) {
    return newEvent<GameNewData>(EventTypes.GameNew, GameNewData.parse(data))
}

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

export function gameConfiguredEvent(data: GameConfiguredData) {
    return newEvent<GameConfiguredData>(EventTypes.GameConfigured, GameConfiguredData.parse(data))
}

export type GameStartedData = z.infer<typeof GameStartedData>
export const GameStartedData = z.object({
    game_id: z.string(),
})

export function gameStartedEvent(data: GameStartedData) {
    return newEvent<GameStartedData>(EventTypes.GameStarted, GameStartedData.parse(data))
}

export type GameQuestionData = z.infer<typeof GameQuestionData>
export const GameQuestionData = z.object({
    game_id: z.string(),
    question: TriviaQuestion,
})

export function gameQuestionEvent(data: GameQuestionData) {
    return newEvent<GameQuestionData>(EventTypes.GameQuestion, GameQuestionData.parse(data))
}

export type GameQuestionEndedData = z.infer<typeof GameQuestionEndedData>
export const GameQuestionEndedData = z.object({
    game_id: z.string(),
    question_id: z.string(),
})

export function gameQuestionEndedEvent(data: GameQuestionEndedData) {
    return newEvent<GameQuestionEndedData>(EventTypes.GameQuestionEnded, GameQuestionEndedData.parse(data))
}

export type GameScoreboardData = z.infer<typeof GameScoreboardData>
export const GameScoreboardData = z.object({
    game_id: z.string(),
    scores: z.array(z.object({
        player_id: z.string(),
        score: z.number(),
        total: z.number(),
    })),
})

export function gameScoreboardEvent(data: GameScoreboardData) {
    return newEvent<GameScoreboardData>(EventTypes.GameScoreboard, GameScoreboardData.parse(data))
}


export type GameDestroyedData = z.infer<typeof GameDestroyedData>
export const GameDestroyedData = z.object({
    game_id: z.string(),
})

export function gameDestroyedEvent(data: GameDestroyedData) {
    return newEvent<GameDestroyedData>(EventTypes.GameDestroyed, GameDestroyedData.parse(data))
}
