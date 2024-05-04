import Highlight from "react-highlight"
import { useGame } from "./GameContextProvider"
// background: "#282a36",

export default function LogCodeBlock() {

    const { events, game } = useGame()

    const reversedLog = events.log.slice().reverse().slice(0, 10)

    const gameSnippet = JSON.stringify(game, null, 2)

    return <div className="grid md:grid-cols-2">
        <div>
            <h2 className="text-xl mb-2">Game State</h2>
            <Highlight className="language-json">
                {gameSnippet}
            </Highlight>
        </div>

        <div>
            <h2 className="text-xl mb-2">Projector State (Last 10)</h2>
            <Highlight className="language-json">
                {JSON.stringify(reversedLog, null, 2)}
            </Highlight>
        </div>
    </div>
}


