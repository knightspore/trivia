import Highlight from "react-highlight"
import "highlight.js/styles/dracula.css"
import { useGame } from "./GameContextProvider"

export default function LogCodeBlock() {

    const { events, game } = useGame()

    const reversedLog = events.log.slice().reverse().slice(0, 10)

    const gameSnippet = JSON.stringify(game, null, 2)

    return <div style={styles.container}>

        <h2>Game State</h2>

        <Highlight className="language-json">
            {gameSnippet}
        </Highlight>

        <hr style={styles.hr} />

        <h2>Projector State (Last 10)</h2>

        <section>
            {reversedLog.length > 0 ? null : "// No events"}
            <Highlight className="language-json">
                {JSON.stringify(reversedLog, null, 2)}
            </Highlight>
        </section>

    </div>
}

const styles = {
    container: {
        fontSize: "16px",
        background: "#282a36",
        color: "#fff",
        padding: "1rem",
        overflow: "auto",
        height: "100%",
        display: "flex",
        flexDirection: "column",
    },
    hr: {
        margin: "1rem",
        opacity: 0.1,
    },
}
