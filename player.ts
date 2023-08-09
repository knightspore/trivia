import { v4 as uuidv4 } from "uuid";
import { Msg } from "./message";

export enum Role {
    Player = 0,
    Streamer,
}

export interface Player {
    id: string,
    name: string,
    role: Role,
    messages: Array<Msg>,
};

export interface Streamer extends Player {
    role: Role.Streamer,
}

export function createPlayer(name: string, messages?: Array<Msg>): Player {
    return {
        id: uuidv4(),
        name,
        role: Role.Player,
        messages: messages ?? [],
    }
}

export function createStreamerPlayer(name: string, messages?: Array<Msg>): Streamer {
    return {
        id: uuidv4(),
        name,
        role: Role.Streamer,
        messages: messages ?? [],
    }
}
