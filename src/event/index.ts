import { z } from "zod";

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

type EventType = z.infer<typeof EventType>
const EventType = z.union([
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

let position = 0

export type Event = z.infer<typeof Event>
export const Event = z.object({
    type: EventType,
    data: z.any(),
}).transform((msg) => {
    return {
        id: crypto.randomUUID(),
        position: position++,
        date: new Date().toString(),
        ...msg,
    }
})

export function newEvent<T>(type: EventType, data: T): Event & { data: T } {
    return Event.parse({ type, data }) as unknown as Event & { data: T }
}

