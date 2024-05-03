import GameContextProvider from './GameContextProvider';
import LogCodeBlock from './LogCodeBlock';
import GameScreenSwitcher from './GameScreenSwitcher';
import { StrictMode } from 'react';


export default function App() {
    return (
        <StrictMode>
            <GameContextProvider>
                <main style={styles.app}>
                    <div style={styles.game}>
                        <h1>A Quick game of Trivia</h1>
                        <GameScreenSwitcher />
                    </div>
                    <LogCodeBlock />
                </main>
            </GameContextProvider>
        </StrictMode>
    )
}

const styles = {
    app: {
        display: "grid",
        gap: "1rem",
        gridTemplateColumns: "1fr 1fr",
        width: "100vw",
        height: "100vh",
    },
    game: {
        padding: "1rem",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
    }
}
