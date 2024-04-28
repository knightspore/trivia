import { ServerWebSocket } from "bun";

export async function drainHandler(ws: ServerWebSocket) {
    console.log(`Drain: ${ws.remoteAddress}`)
}
