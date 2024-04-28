import { ServerWebSocket, WebSocketServeOptions } from "bun";
import { RawMsg, createMsg } from "../game/message";
import { strOrBufToString } from "../utils";

export interface ServerConfig {
    port: number,
    onMessage: (
        ws: ServerWebSocket, message: string | Buffer
    ) => void;
    onOpen: (ws: ServerWebSocket) => void;
    onClose: (ws: ServerWebSocket, code: number, reason: string) => void;
    onDrain: (ws: ServerWebSocket) => void;
}

export function createServerConfig(cfg: ServerConfig): WebSocketServeOptions {
    return {
        port: cfg.port,
        fetch(req, server) {
            if (server.upgrade(req)) {
                return; // do not return response for ws
            }
            return new Response("Error parsing WebSocket Request", { status: 500 });
        },
        websocket: {
            perMessageDeflate: true,
            message: cfg.onMessage,
            open: cfg.onOpen,
            close: cfg.onClose,
            drain: cfg.onDrain,
        },
    };
}

export function decodeMessage(message: string | Buffer): { data: any, error: boolean } {
    const raw = strOrBufToString(message);
    const json: RawMsg = JSON.parse(raw)
    if (!json.command) {
        return { data: null, error: true }
    }
    return {
        data: createMsg(json.text ?? "", json.command),
        error: false,
    }
}

