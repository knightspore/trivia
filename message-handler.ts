import { ServerWebSocket } from "bun";
import { decodeMessage } from "./websocket-server";
import { Command } from "./message";

export async function messageHandler(ws: ServerWebSocket, message: string | Buffer) {
    console.log(`Message: ${ws.remoteAddress}`)
    const { data, error } = decodeMessage(message)
    if (!error && data) {
        switch (data.type) {
            case Command.Generic:
                console.log("Generic Message:")
                console.log(data.text)
                break;
        }
    }
}
