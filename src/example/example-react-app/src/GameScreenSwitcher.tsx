import { useGame } from "./GameContextProvider"
import Start from "./Screens/Start"
import Setup from "./Screens/Setup"
import Questions from "./Screens/Questions";

export default function GameScreenSwitcher() {

    const { game } = useGame();

    const cases = {
        NO_GAME: game.id === undefined,
        NOT_READY: !game.ready,
        NO_START: game.started_at === undefined,
        IN_PROGRESS: game.ended_at === undefined,
        SCOREBOARD: game.ended_at !== undefined,
    }

    return (
        <div>
            {(() => {
                switch (true) {
                    case cases.NO_GAME:
                        return <Start />
                    case cases.NOT_READY:
                        return <Setup />
                    case cases.NO_START:
                        return <p>Setting up game...</p>
                    case cases.IN_PROGRESS:
                        return <Questions />
                    case cases.SCOREBOARD:
                        return <>
                            <h3>Scoreboard {game.score}</h3>
                            {game.questions?.map(q => {
                                const answer_needle = parseInt(game.answers[q.id])
                                const correct = q.haystack[answer_needle] === q.correct_answer
                                return (
                                    <div style={{ paddingBottom: "1rem" }}>
                                        <p>
                                            {correct ? "✅" : "❌"}
                                        </p>
                                        <h4>{q.question}</h4>
                                        <p>Answer: {q.correct_answer}</p>
                                        <p>Your answer: {q.haystack[answer_needle]}</p>
                                    </div>
                                )
                            })}
                        </>
                }
            })()}
        </div>

    )
}
