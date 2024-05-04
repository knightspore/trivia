import { useGame } from "./GameContextProvider"
import Start from "./Screens/Start"
import Setup from "./Screens/Setup"
import Questions from "./Screens/Questions";
import Scoreboard from "./Screens/Scoreboard";

export default function GameScreenSwitcher() {

    const { game } = useGame();

    return (
        <div>
            {(() => {
                switch (true) {
                    case game.id === undefined:
                        return <Start />
                    case !game.ready:
                        return <Setup />
                    case game.started_at === undefined:
                        return <p>Setting up game...</p>
                    case game.ended_at === undefined:
                        return <Questions />
                    case game.ended_at !== undefined:
                        return <Scoreboard />
                }
            })()}
        </div>

    )
}
