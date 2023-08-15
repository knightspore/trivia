import { Command, RawMsg } from "../game/message";

const socket = new WebSocket("ws://localhost:5000");

socket.addEventListener("open", event => {
    console.log("Open")
    socket.send(JSON.stringify({ command: Command.Start } as RawMsg))
})

socket.addEventListener("message", (event: MessageEvent) => {
    console.log("Message")
    console.log(event.data)
})

socket.addEventListener("close", event => {
    console.log("Close")
})


