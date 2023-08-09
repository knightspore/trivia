import { ServerWebSocket } from "bun";

export async function openHander(ws: ServerWebSocket) {
    console.log(`Open: ${ws.remoteAddress}`)
}
