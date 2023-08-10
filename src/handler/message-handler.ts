import { ServerWebSocket } from "bun";
import { decodeMessage } from "../server/websocket-server";
import { Command } from "../game/message";
import { startGame } from "..";

export async function messageHandler(ws: ServerWebSocket, message: string | Buffer) {
    const { data, error } = decodeMessage(message)
    if (!error && data) {
        switch (data.command) {
            case Command.Start:
                LogNewCommand(Command.Start, "")
                startGame(ws)
                break;
            case Command.Next:
                LogNewCommand(Command.Next, "")
                console.log(data.text)
                break;
            case Command.Answer:
                LogNewCommand(Command.Answer, "")
                console.log(data.text)
                break;
            case Command.New:
                LogNewCommand(Command.New, "")
                console.log(data.text)
                break;
            default:
                break;
        }
    }
}

function LogNewCommand(command: Command, user: string) {
    console.log(`::CMD:: > ${Command[command]} (${user})`);
}
