import { useEffect, useState } from "react";
import { TriviaQuestion } from "../../../../trivia/types";
import { EventTypes, GameDestroyedData, PlayerReadyData } from "../../../types";
import { useGame } from "../GameContextProvider"

export default function Questions() {

    const { game: { id, questions, answers }, events: { push, project } } = useGame();

    const [index, setIndex] = useState<number | null>(null)

    useEffect(() => {
        setIndex((current) => {
            const keys = Object.keys(answers).length
            if (keys === questions?.length) push(EventTypes.GameDestroyed, { game_id: id! })
            if (keys === 0) {
                return 0
            }
            if (current !== null && current < keys) {
                return keys
            }
            return current
        })
    }, [answers])

    const currentQuestion: TriviaQuestion | null = questions?.[index ?? 0] ?? null;

    return (
        <div>
            <h3>Question {index ? index + 1 : ""}:
                <div
                    dangerouslySetInnerHTML={{ __html: currentQuestion?.question ?? "" }}
                />
            </h3>
            <div style={{ marginTop: "1rem", display: "flex", justifyContent: "space-evenly" }}>
                {currentQuestion?.haystack.map((answer, i) => (
                    <button
                        key={i}
                        onClick={() => push(EventTypes.PlayerAnswer, {
                            game_id: id,
                            player_id: project<PlayerReadyData>({ type: EventTypes.PlayerReady })[0].data.player_id,
                            question_id: currentQuestion?.id,
                            answer: i
                        })}
                    >
                        <div dangerouslySetInnerHTML={{ __html: answer }} />
                    </button>
                ))}
            </div>
        </div>
    )

}
