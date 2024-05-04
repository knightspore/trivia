import { useEffect, useState } from "react";
import { TriviaQuestion } from "../../../../trivia/types";
import { EventTypes, GameDestroyedData, PlayerReadyData } from "../../../types";
import { useGame } from "../GameContextProvider"
import Button from "../Button";

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
        <>
            <h3
                className="text-2xl"
                dangerouslySetInnerHTML={{ __html: currentQuestion?.question ?? "" }}
            />
            <div className="mt-4 flex justify-evenly">
                {currentQuestion?.haystack.map((answer, i) => (
                    <Button
                        key={i}
                        onClick={() => push(EventTypes.PlayerAnswer, {
                            game_id: id,
                            player_id: project<PlayerReadyData>({ type: EventTypes.PlayerReady })[0].data.player_id,
                            question_id: currentQuestion?.id,
                            answer: i
                        })}
                    >
                        <div dangerouslySetInnerHTML={{ __html: answer }} />
                    </Button>
                ))}
            </div>
        </>
    )

}
