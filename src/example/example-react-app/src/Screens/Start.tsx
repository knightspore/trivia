import { EventTypes } from "../../../types";
import { useGame } from "../GameContextProvider"

export default function NoGame() {

    const { events: { push } } = useGame();

    return (
        <button
            onClick={() => push(EventTypes.GameNew, { game_id: crypto.randomUUID() })}
        >
            Start
        </button >
    )
}
