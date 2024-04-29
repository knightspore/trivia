import { z } from "zod"
import { EventTypes, newEvent } from "./"

export type PlayerReadyData = z.infer<typeof PlayerReadyData>
export const PlayerReadyData = z.object({
    game_id: z.string(),
    player_id: z.string(),
})

export function playerReadyEvent(data: PlayerReadyData) {
    return newEvent<PlayerReadyData>(EventTypes.PlayerReady, PlayerReadyData.parse(data))
}

export type PlayerAnswerData = z.infer<typeof PlayerAnswerData>
export const PlayerAnswerData = z.object({
    game_id: z.string(),
    player_id: z.string(),
    question_id: z.string(),
    answer: z.number(),
})

export function playerAnswerEvent(data: PlayerAnswerData) {
    return newEvent<PlayerAnswerData>(EventTypes.PlayerAnswer, PlayerAnswerData.parse(data))
}
