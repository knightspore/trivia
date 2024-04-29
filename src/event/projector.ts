import type { TriviaQuestion } from "../trivia/types";
import { Event, EventType, EventTypes, GameConfiguredData, GameDestroyedData, GameNewData, GameStartedData, PlayerAnswerData, PlayerReadyData, type EventLog } from "./types";

type TypedEvent<T> = Event & { data: T };

export function projector<T>(
    log: EventLog,
    type: EventType,
    position: number = 0
): Array<TypedEvent<T>> {
    const events = [] as TypedEvent<T>[];
    for (const event of log.slice(position)) {
        if (event.type === type) {
            events.push(event as TypedEvent<T>)
        }
    }
    return events;
}

interface GameState {
    id: string;
    lastPosition: number;
    running: [string, string?];
    configured: GameConfiguredData;
    ready: string;
    score: number;
    total: number;
    started_at: string;
    ended_at: string;
    events: Event[];
    questions: TriviaQuestion[];
    answers: PlayerAnswerData[];
}

export function gameStateProjector(log: EventLog): Record<string, Partial<GameState>> {
    const states: Record<string, Partial<GameState>> = {};

    const gameNewEvents = projector<GameNewData>(log, EventTypes.GameNew)

    for (const event of gameNewEvents) {
        states[event.data.game_id] = {
            id: event.data.game_id,
            lastPosition: event.position,
        }

        const gameConfiguredEvents = projector<GameConfiguredData>(log, EventTypes.GameConfigured, states[event.data.game_id].lastPosition)
        for (const event of gameConfiguredEvents) {
            states[event.data.game_id] = {
                ...states[event.data.game_id],
                configured: event.data.config,
                lastPosition: event.position,
            }
        }

        const playerReadyEvents = projector<PlayerReadyData>(log, EventTypes.PlayerReady, states[event.data.game_id].lastPosition)
        for (const event of playerReadyEvents) {
            states[event.data.game_id] = {
                ...states[event.data.game_id],
                ready: event.date,
                lastPosition: event.position,
            }
        }

        const gameStartedEvents = projector<GameStartedData>(log, EventTypes.GameStarted, states[event.data.game_id].lastPosition)
        for (const event of gameStartedEvents) {
            states[event.data.game_id] = {
                ...states[event.data.game_id],
                running: [event.date],
                lastPosition: event.position,
            }
        }

        const gameStartPosition = states[event.data.game_id].lastPosition

        const questionEvents = projector<TriviaQuestion>(log, EventTypes.GameQuestion, gameStartPosition)
        for (const event of questionEvents) {
            states[event.data.game_id] = {
                ...states[event.data.game_id],
                total: (states[event.data.game_id].total || 0) + 1,
                lastPosition: event.position,
                questions: [...(states[event.data.game_id].questions || []), event.data.question],
            }
        }

        const playerAnswerEvents = projector<PlayerAnswerData>(log, EventTypes.PlayerAnswer, gameStartPosition)
        for (const event of playerAnswerEvents) {
            states[event.data.game_id] = {
                ...states[event.data.game_id],
                score: (states[event.data.game_id].score || 0) + 1,
                lastPosition: event.position,
            }
        }

        const gameDestroyedEvents = projector<GameDestroyedData>(log, EventTypes.GameDestroyed, states[event.data.game_id].lastPosition)
        for (const event of gameDestroyedEvents) {
            states[event.data.game_id] = {
                ...states[event.data.game_id],
                running: [states[event.data.game_id].running![0], event.date],
                lastPosition: event.position,
            }
        }

    }

    return states
}
