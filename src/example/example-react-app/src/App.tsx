import { FormEvent, createContext, useContext, useState } from 'react'
import { IGameState } from "../../core"
import { EventTypes, GameConfiguredData } from '../../types';
import { Category, Difficulty, QuestionFormat } from '../../../trivia/types';
import { EventFilters, newEvent, printEvent, projector } from '../../../event';
import { Event, TypedEvent } from '../../../event/types';

const GameContext = createContext<IGameState>({} as IGameState);

export function useGame() {
    const value = useContext(GameContext);
    if (!value) throw new Error('useGame must be used within a GameProvider');
    return value;
}

function App() {
    
    type GameStatePartial = Omit<IGameState, "create" | "hydrate" | "push" | "pos" | "project"| "printEvent">;
    // TODO: Use setGameState
    const [gameState, setGameState] = useState<GameStatePartial>({
        // IEventLog
        log: [],
        position: 0,
        // IGameState
        id: undefined,
        started_at: undefined,
        ended_at: undefined,
        configured: undefined,
        ready: undefined,
        score: 0,
        total: 0,
        questions: [],
        lastHydrated: undefined,
    });

    function create<T>(type: string, data: T): Event & { data: T } {
        const event = newEvent(type, data, pos())
        gameState.position += 1
        return event
    }

    function pos(): number {
        if (gameState.log.length !== gameState.position) throw new Error("EventLog position mismatch")
        return gameState.log.length
    }

    function project<T>(filters?: EventFilters): TypedEvent<T>[] {
        return projector<T>(gameState.log, filters ?? {})
    }

    function hydrate(): void {
        for (const event of project()) {
            console.log("TODO: Projector hydrate", event)
        }
    }

    const providerValue = {
            ...gameState,
            create,
            push: gameState.log.push,
            pos,
            project,
            printEvent,
            hydrate,
    }

    return (
        <GameContext.Provider value={providerValue}>
            <main className="p-2">
                <ScreenStart />
            </main>
        </GameContext.Provider>
    )
}

function ScreenStart() {

    const game = useGame();

    const [config, setConfig] = useState<GameConfiguredData['config']>({
        category: Category.GeneralKnowledge,
        difficulty: Difficulty.Easy,
        questionType: QuestionFormat.Multiple,
        amount: 10
    })

    function submit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        console.log(config)
        const game_id = crypto.randomUUID();
        game.push(game.create(EventTypes.GameConfigured, { game_id, config }))
    }

    return (
        <>
            <h1>A Quick game of Trivia</h1>
            <form onSubmit={submit}>
                <div>
                    <label htmlFor="category">Category</label>
                    <select
                        id="category"
                        name="category"
                        defaultValue={config.category}
                        onChange={(e) => setConfig({ ...config, category: parseInt(e.target.value) })}
                    >
                        <option value={Category.GeneralKnowledge}>General Knowledge</option>
                        <option value={Category.Books}>Books</option>
                        <option value={Category.Film}>Film</option>
                        <option value={Category.Music}>Music</option>
                        <option value={Category.Theatre}>Theatre</option>
                        <option value={Category.Tevelision}>Television</option>
                        <option value={Category.VideoGames}>Video Games</option>
                        <option value={Category.BoardGames}>Board Games</option>
                        <option value={Category.Science}>Science</option>
                        <option value={Category.Computers}>Computers</option>
                        <option value={Category.Mathematics}>Mathematics</option>
                        <option value={Category.Mythology}>Mythology</option>
                        <option value={Category.Sports}>Sports</option>
                        <option value={Category.Geography}>Geography</option>
                        <option value={Category.History}>History</option>
                        <option value={Category.Politics}>Politics</option>
                        <option value={Category.Art}>Art</option>
                        <option value={Category.Celebrities}>Celebrities</option>
                        <option value={Category.Animals}>Animals</option>
                        <option value={Category.Vehichles}>Vehicles</option>
                        <option value={Category.Comics}>Comics</option>
                        <option value={Category.Gadgets}>Gadgets</option>
                        <option value={Category.Anime}>Anime</option>
                        <option value={Category.Cartoons}>Cartoons</option>
                    </select>
                </div>

                <div>
                    <label htmlFor="difficulty">Difficulty</label>
                    <select
                        id="difficulty"
                        name="difficulty"
                        defaultValue={config.difficulty}
                        onChange={(e) => setConfig({ ...config, difficulty: e.target.value as Difficulty })}
                    >
                        <option value={Difficulty.Easy}>Easy</option>
                        <option value={Difficulty.Medium}>Medium</option>
                        <option value={Difficulty.Hard}>Hard</option>
                    </select>
                </div>

                <div>
                    <label htmlFor="question_format">Question Format</label>
                    <select
                        id="question_format"
                        name="question_format"
                        defaultValue={config.questionType}
                        onChange={(e) => setConfig({ ...config, questionType: e.target.value as QuestionFormat })}
                    >
                        <option value={QuestionFormat.Multiple}>Multiple Choice</option>
                        <option value={QuestionFormat.Boolean}>True / False</option>
                    </select>
                </div>

                <div>
                    <label htmlFor="amount">Amount</label>
                    <span>
                        <input
                            id="amount"
                            name="amount"
                            type="range"
                            min="1"
                            max="20"
                            defaultValue={config.amount}
                            onChange={(e) => setConfig({ ...config, amount: parseInt(e.target.value) })}
                        />
                        {config.amount}
                    </span>
                </div>

                <button type="submit">Begin</button>

            </form>
        </>
    )
}

export default App
