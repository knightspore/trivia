import { Event, EventTypes, PlayerAnswerData, PlayerReadyData, type EventLog, type EventType } from "./types"
import { GameConfiguredData, GameDestroyedData, GameNewData, GameQuestionData, GameScoreboardData, GameStartedData } from "./types"

export function newEvent<T>(
    type: EventType,
    data: T,
    position: number
): Event & { data: T } {
    return Event.parse({ type, data, position }) as unknown as Event & { data: T }
}

export function printEvent(e: Event): string {
    return `\n// ---[${e.type}]\n`
        + `| - id: ${e.id}\n`
        + `| - pos: ${e.position}\n`
        + `| - date: ${e.date}\n`
        + `| - data: ${Object.keys(e.data).join(", ")}\n`
        + `\\\\---[${e.type}]\n`
}

export function newEventLog(): {
    log: EventLog,
    push: (event: Event) => void,
    pos: () => number,
} {
    const log: EventLog = [] as unknown as EventLog
    let position = 0
    return {
        log,
        push: (event: Event) => {
            log.push(event)
            position++;
        },
        pos: () => position,
    }
}

// Player

export function playerReadyEvent(data: PlayerReadyData, position: number) {
    return newEvent<PlayerReadyData>(EventTypes.PlayerReady, PlayerReadyData.parse(data), position)
}

export function playerAnswerEvent(data: PlayerAnswerData, position: number) {
    return newEvent<PlayerAnswerData>(EventTypes.PlayerAnswer, PlayerAnswerData.parse(data), position)
}

// Game

export function gameNewEvent(data: GameNewData, position: number) {
    return newEvent<GameNewData>(EventTypes.GameNew, GameNewData.parse(data), position)
}

export function gameConfiguredEvent(data: GameConfiguredData, position: number) {
    return newEvent<GameConfiguredData>(EventTypes.GameConfigured, GameConfiguredData.parse(data), position)
}

export function gameStartedEvent(data: GameStartedData, position: number) {
    return newEvent<GameStartedData>(EventTypes.GameStarted, GameStartedData.parse(data), position)
}

export function gameQuestionEvent(data: GameQuestionData, position: number) {
    return newEvent<GameQuestionData>(EventTypes.GameQuestion, GameQuestionData.parse(data), position)
}

export function gameScoreboardEvent(data: GameScoreboardData, position: number) {
    return newEvent<GameScoreboardData>(EventTypes.GameScoreboard, GameScoreboardData.parse(data), position)
}

export function gameDestroyedEvent(data: GameDestroyedData, position: number) {
    return newEvent<GameDestroyedData>(EventTypes.GameDestroyed, GameDestroyedData.parse(data), position)
}
