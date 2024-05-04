import { useGame } from "../GameContextProvider"

export default function Scoreboard() {

    const { game } = useGame();

    return <>
        <h3 className="text-2xl">Scoreboard {game.score}</h3>
        <div className="space-y-4 mt-4">
            {game.questions?.map(q => {
                const answer_needle = parseInt(game.answers[q.id])
                const correct = q.haystack[answer_needle] === q.correct_answer
                return (
                    <div className="p-2 border border-pink-700 rounded">
                        <p className="text-xs font-bold">{q.category}</p>
                        <h4 className="mt-2 text-lg font-medium">
                             <span dangerouslySetInnerHTML={{ __html: q.question }}></span>
                        </h4>
                        <p>Answer: {q.correct_answer}</p>
                        <p>Your answer: {correct ? "✅" : "❌"} {q.haystack[answer_needle]}</p>
                    </div>
                )
            })}
        </div>
    </>
}
