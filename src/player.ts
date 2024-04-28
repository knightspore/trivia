import { z } from "zod";
import { Message } from "./message";

export enum Role {
    Player = 0,
    Host,
}

export type Player = z.infer<typeof Player>
export const Player = z.object({
    name: z.string(),
    role: z.nativeEnum(Role),
}).transform((player) => {
    return {
        id: crypto.randomUUID(),
        ...player,
        messages: z.array(Message)
    }
})

export const Host = Player.transform((player) => {
    return {
        ...player,
        role: Role.Host
    }
})

export function createPlayer(name: string): Player {
    return Player.parse({ name, role: Role.Player });
}

export function createHost(name: string): Player {
    return Host.parse({ name, role: Role.Host });
}
