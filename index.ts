import { createServerConfig } from "./websocket-server";
import { Msg } from "./message";
import { Player } from "./player";
import { messageHandler } from "./message-handler";
import { openHander } from "./open-handler";
import { closeHandler } from "./close-handler";
import { drainHandler } from "./drain-handler";

const PLAYERS: Record<string, Player> = {}
const MESSAGES: Record<string, Msg> = {}

const serverConfig = createServerConfig({
    port: 3000,
    onMessage: messageHandler,
    onOpen: openHander,
    onClose: closeHandler,
    onDrain: drainHandler,
})

Bun.serve(serverConfig);

/*
    * wait for...
    *
    * startRound() {
    *   
    *   openAnswerWindow()
    *
    *   sendQuestion()
    *
    *   beginTimer()
    *
    *   wait() -> ...CollectAnswers() -> ...updateLeaderBoard()
    *
    *   endTimer()
    *
    *   sendResults()
    *
    * }
    */
