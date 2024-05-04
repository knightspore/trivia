import { EventTypes } from "../../../types";
import Button from "../Button";
import { useGame } from "../GameContextProvider"

export default function NoGame() {

    const { events: { push } } = useGame();

    function newGame() {
        push(EventTypes.GameNew, {
            game_id: crypto.randomUUID()
        })
    }

    return (
        <Button onClick={() => newGame()}>
            Start
        </Button>
    )
}
