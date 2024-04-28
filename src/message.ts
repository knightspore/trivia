import { z } from "zod";

export enum Command {
    Generic = 0,
    Start,
    Next,
    Answer,
    New
}

export type Message = z.infer<typeof Message>
export const Message = z.object({
    command: z.nativeEnum(Command),
    text: z.string().optional(),
}).transform((msg) => {
    return {
        id: crypto.randomUUID(),
        date: new Date().toString(),
        ...msg,
    }
})

export function newMessage(command: Command, text?: string): Message {
    return Message.parse({ command, text })
}
