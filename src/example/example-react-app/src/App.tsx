import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { EventFilters, newEvent, printEvent, projector } from '../../../event';
import { Event, TypedEvent } from '../../../event/types';
import ScreenStart from './ScreenStart';
import { EventTypes, GameConfiguredData } from '../../types';
import { TriviaQuestion } from '../../../trivia/types';

interface EventLog {
    log: Event[],
    push<T>(type: string, data: T, position?: number): void,
    project<T>(filters?: EventFilters): TypedEvent<T>[],
    printEvent(e: Event): string,
    hydrate(): void,
}

interface GameStateData {
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

export default function App() {

    const [log, setLog] = useState<Event[]>([])

    const [hydrating, setHydrating] = useState<boolean>(false)

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
        console.table(events);
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
                    console.log("PlayerAnswer", event)
                    break;
                default:
                    console.log("Unhandled event", event)
            }
        }
    }, [project, setGame])

    useEffect(() => {
        setHydrating(true)
        hydrate()
        return () => {
            setHydrating(false)
        }
    }, [hydrate])

    const providerValue = {
        events: {
            log, push, project, printEvent, hydrate
        },
        game,
    }

    return (
        <GameContext.Provider value={providerValue}>
            <main style={styles.app}>
                <div>
                    <h1>A Quick game of Trivia {hydrating && "..."}</h1>
                    <ScreenStart />
                    {(() => {
                        switch (true) {
                            case game.id === undefined:
                                return <p>Ready to Start</p>
                            case game.configured === undefined:
                                return <p>Ready to Configure</p>
                            case !game.ready:
                                return <p>Ready for Player Ready</p>
                            case game.started_at === undefined:
                                return <p>Ready for Game Start</p>
                            case game.questions?.length === 0:
                                return <p>Ready for Questions</p>
                            case game.ended_at === undefined:
                                return <p>Game in Progress</p>
                            case game.ended_at !== undefined:
                                return <p>Scoreboard</p>
                            default:
                                return <p>Game Over</p>
                        }
                    })()}
                </div>
                <pre style={styles.pre}>
                    <h2>Game State</h2>
                    {JSON.stringify(game, null, 2)}
                    <h2>Projector History</h2>
                    {JSON.stringify(projector(log, {}), null, 2)}
                </pre>
            </main>
        </GameContext.Provider>
    )
}

const styles = {
    app: {
        display: "grid",
        gap: "1rem",
        gridTemplateColumns: "2fr 1fr",
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
    },
    pre: {
        fontFamily: "monospace",
        fontSize: "12px",
        background: "#191919",
        color: "#fff",
        padding: "1rem",
        overflow: "auto",
    }
}
