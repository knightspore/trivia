import { GameConfiguredData } from "./types";

export function gameStateProjector(log: Event[]): Array<{}> {
    const states: Array<{}> = [];

    const gameNewEvents = gameNewProjector(log)

    for (const event of gameNewEvents) {

        const gameState: Partial<{}> = {
            id: event.data.game_id,
            lastPosition: event.position,
            running: [] as unknown as [number, number?],
            configured: {} as unknown as GameConfiguredData,
            events: [],
            questions: [],
            answers: [],
        }

        gameConfiguredProjector(log)
            .forEach(event => {
                gameState.configured = event.data.configured
                gameState.lastPosition = event.position
            })


        playerReadyProjector(log)
            .forEach(event => {
                gameState.ready = event.data
                gameState.lastPosition = event.position
            })

        gameStartedProjector(log)
            .forEach(event => {
                gameState.running = [event.date]
                gameState.lastPosition = event.position
            })

        gameQuestionProjector(log)
            .forEach(event => {
                gameState.lastPosition = event.position
                gameState.total = (gameState.total ?? 0) + 1
                gameState.questions!.push(event.data)
            })

        playerAnswerProjector(log)
            .forEach(event => {
                gameState.lastPosition = event.position
                gameState.answers!.push(event.data)
            })

        gameDestroyedProjector(log)
            .forEach(event => {
                gameState.running!.push(event.date)
                gameState.lastPosition = event.position
            })

        states.push(gameState as {})

    }

    return states
}
