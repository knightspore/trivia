import { ServerWebSocket } from "bun";

export async function closeHandler(ws: ServerWebSocket, code: number, reason: string) {
    console.log(`Close: ${ws.remoteAddress} (${code} [${reason}])`)
}
