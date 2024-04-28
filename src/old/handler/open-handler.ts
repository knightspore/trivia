import { ServerWebSocket } from "bun";
import { getOrCreatePlayer } from "..";

export async function openHandler(ws: ServerWebSocket) {
    const player = getOrCreatePlayer(ws.remoteAddress)
    console.log(`Player ${player.id} connected`)
}
