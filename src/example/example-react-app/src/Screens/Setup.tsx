import { FormEvent, useEffect, useState } from "react";
import { Category, Difficulty, QuestionFormat } from "../../../../trivia/types";
import { EventTypes, GameConfiguredData } from "../../../types";
import { useGame } from "../GameContextProvider";

export default function Setup() {
    const { events: { push }, game } = useGame();

    const [config, setConfig] = useState<GameConfiguredData['config']>({
        category: Category.GeneralKnowledge,
        difficulty: Difficulty.Easy,
        questionType: QuestionFormat.Multiple,
        amount: 10
    })


    useEffect(() => {
        push(EventTypes.GameConfigured, { game_id: game.id, config })
    }, [config])

    function submit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        push(EventTypes.PlayerReady, {
            game_id: game.id,
            player_id: crypto.randomUUID()
        });
    }

    return (
        <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
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
    )
}
