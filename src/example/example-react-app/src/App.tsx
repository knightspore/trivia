import GameContextProvider from './GameContextProvider';
import LogCodeBlock from './LogCodeBlock';
import GameScreenSwitcher from './GameScreenSwitcher';
import { StrictMode } from 'react';


export default function App() {
    return (
        <StrictMode>
            <GameContextProvider>
                <main className="p-4 text-pink-700 bg-cyan-200 min-h-screen">
                    <h1 className="text-4xl text-center font-bold">A Quick Game of Trivia</h1>
                    <div className="flex justify-center mt-4 mb-8">
                        <GameScreenSwitcher />
                    </div>
                    <LogCodeBlock />
                </main>
            </GameContextProvider>
        </StrictMode>
    )
}
