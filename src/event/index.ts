import { Event, EventTypes, PlayerAnswerData, PlayerReadyData, type EventType } from "./types"
import { GameConfiguredData, GameDestroyedData, GameNewData, GameQuestionData, GameQuestionEndedData, GameScoreboardData, GameStartedData } from "./types"

export function newEvent<T>(
    type: EventType,
    data: T
): Event & { data: T } {
    return Event.parse({ type, data }) as unknown as Event & { data: T }
}

// Player

export function playerReadyEvent(data: PlayerReadyData) {
    return newEvent<PlayerReadyData>(EventTypes.PlayerReady, PlayerReadyData.parse(data))
}

export function playerAnswerEvent(data: PlayerAnswerData) {
    return newEvent<PlayerAnswerData>(EventTypes.PlayerAnswer, PlayerAnswerData.parse(data))
}

// Game

export function gameNewEvent(data: GameNewData) {
    return newEvent<GameNewData>(EventTypes.GameNew, GameNewData.parse(data))
}

export function gameConfiguredEvent(data: GameConfiguredData) {
    return newEvent<GameConfiguredData>(EventTypes.GameConfigured, GameConfiguredData.parse(data))
}

export function gameStartedEvent(data: GameStartedData) {
    return newEvent<GameStartedData>(EventTypes.GameStarted, GameStartedData.parse(data))
}


export function gameQuestionEvent(data: GameQuestionData) {
    return newEvent<GameQuestionData>(EventTypes.GameQuestion, GameQuestionData.parse(data))
}


export function gameQuestionEndedEvent(data: GameQuestionEndedData) {
    return newEvent<GameQuestionEndedData>(EventTypes.GameQuestionEnded, GameQuestionEndedData.parse(data))
}

export function gameScoreboardEvent(data: GameScoreboardData) {
    return newEvent<GameScoreboardData>(EventTypes.GameScoreboard, GameScoreboardData.parse(data))
}

export function gameDestroyedEvent(data: GameDestroyedData) {
    return newEvent<GameDestroyedData>(EventTypes.GameDestroyed, GameDestroyedData.parse(data))
}
