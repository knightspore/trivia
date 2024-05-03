import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { EventFilters, newEvent, printEvent, projector } from '../../../event';
import { Event, TypedEvent } from '../../../event/types';
import { EventTypes, GameConfiguredData } from '../../types';
import { TriviaQuestion } from '../../../trivia/types';
import { Trivia } from '../../../trivia';

export interface EventLog {
    log: Event[],
    push<T>(type: string, data: T, position?: number): void,
    project<T>(filters?: EventFilters): TypedEvent<T>[],
    printEvent(e: Event): string,
    hydrate(): void,
}

export interface GameStateData {
    id?: string,
    started_at?: number,
    ended_at?: number,
    configured?: GameConfiguredData,
    ready?: true | undefined,
    score: number,
    total: number,
    questions?: TriviaQuestion[],
    answers: Record<string, string>,
    lastHydrated?: number,
    trivia: Trivia | null,
}

interface GameContextType {
    events: EventLog,
    game: GameStateData,
}

const GameContext = createContext<GameContextType>({} as GameContextType);

export function useGame(): GameContextType {
    const value = useContext(GameContext);
    if (!value) throw new Error('useGame must be used within a GameProvider');
    return value;
}
export default function GameContextProvider({ children }: { children: React.ReactNode }) {

    const [log, setLog] = useState<Event[]>([])

    const [game, setGame] = useState<GameStateData>({
        id: undefined,
        started_at: undefined,
        ended_at: undefined,
        configured: undefined,
        ready: undefined,
        score: 0,
        total: 0,
        questions: [],
        answers: {},
        lastHydrated: undefined,
        trivia: null,
    });

    function push<T>(type: string, data: T, pos?: number) {
        setLog(current => [
            ...current,
            newEvent(type, data, pos ?? current.length)
        ])
    }

    const project = useCallback((filters?: EventFilters) => {
        return projector(log, filters ?? {})
    }, [log])


    const hydrate = useCallback(() => {
        const events = project();
        for (const event of events) {
            switch (event.type) {
                case EventTypes.GameNew:
                    setGame((current) => ({
                        ...current,
                        id: event.data.game_id
                    }))
                    break;
                case EventTypes.GameConfigured:
                    setGame((current) => ({
                        ...current,
                        configured: event.data
                    }))
                    break;
                case EventTypes.PlayerReady:
                    setGame((current) => ({
                        ...current,
                        ready: true
                    }))
                    break;
                case EventTypes.GameStarted:
                    setGame((current) => ({
                        ...current,
                        started_at: event.date
                    }))
                    break;
                case EventTypes.GameQuestion:
                    setGame((current) => ({
                        ...current,
                        questions: [...(current.questions ?? []), event.data]
                    }))
                    break;
                case EventTypes.PlayerAnswer:
                    setGame((current) => ({
                        ...current,
                        answers: {
                            ...current.answers,
                            [event.data.question_id]: event.data.answer
                        }
                    }))
                    break;
                case EventTypes.GameDestroyed:
                    setGame((current) => ({
                        ...current,
                        ended_at: event.date,
                        score: game.questions?.reduce((acc, q) => {
                            const answer = game.answers[q.id]
                            return acc + (q.needle === parseInt(answer) ? 1 : 0)
                        }, 0) ?? 0
                    }))
                    break;
                default:
                    console.log("Unhandled event", event)
            }
        }
    }, [project, setGame])

    // Run Hydrations
    useEffect(() => {
        if (game.lastHydrated === undefined) {
            hydrate()
        }
    }, [hydrate, game.lastHydrated])

    async function setupTrivia() {
        const { category, difficulty, questionType, amount } = game.configured!.config

        const trivia = new Trivia(category, difficulty, questionType, amount)
        const questions = await trivia.getQuestions()

        setGame((current) => ({
            ...current,
            trivia,
            questions,
        }))

        push(EventTypes.GameStarted, { game_id: game.id })
    }

    // Wait for Ready State
    useEffect(() => {
        if (game.ready && game.started_at === undefined) {
            setupTrivia()
        }
    }, [game.ready, game.configured])

    const providerValue = {
        events: {
            log, push, project, printEvent, hydrate
        },
        game,
    }

    return (
        <GameContext.Provider value={providerValue}>
            {children}
        </GameContext.Provider>
    )

}
