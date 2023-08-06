import { ServerWebSocket } from "bun";
import { v4 as uuidv4 } from "uuid";

export type Player = {
  id: string;
  remoteAddress: string;
};

const players: Record<string, Player> = {};

export function getOrCreatePlayer(ws: ServerWebSocket): Player {
  if (players[ws.remoteAddress]) {
    return players[ws.remoteAddress];
  }
  players[ws.remoteAddress] = {
    id: uuidv4(),
    remoteAddress: ws.remoteAddress,
  };
  return players[ws.remoteAddress];
}
