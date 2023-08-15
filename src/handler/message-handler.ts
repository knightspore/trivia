import { ServerWebSocket } from "bun";
import { decodeMessage } from "../server/websocket-server";
import { Command } from "../game/message";
import { PLAYERS, startGame } from "..";

export async function messageHandler(ws: ServerWebSocket, message: string | Buffer) {
    console.group()
    const { data, error } = decodeMessage(message)
    if (!error && data) {
        ParseGameCommand(ws, data.command, data.text)
    }
    console.groupEnd()
}

function ParseGameCommand(ws: ServerWebSocket, c: Command, s?: string) {
    const player = PLAYERS[ws.remoteAddress]
    switch (c) {
        case Command.Start:
            LogNewCommand(Command.Start, player.name)
            startGame(ws)
            break;
        case Command.Next:
            LogNewCommand(Command.Next, player.name)
            console.log(s)
            break;
        case Command.Answer:
            LogNewCommand(Command.Answer, player.name)
            console.log(s)
            break;
        case Command.New:
            LogNewCommand(Command.New, player.name)
            console.log(s)
            break;
        default:
            break;
    }
}

function LogNewCommand(command: Command, user: string) {
    console.log(`New Command > ${Command[command]} (${user})`);
}

