import { v4 as uuidv4 } from "uuid";

export enum Command {
    Generic = 0,
    Start,
    Next,
    Answer,
    New
}

export interface RawMsg {
    command: Command,
    text?: string,
}

export interface Msg extends RawMsg {
    id: string,
    date: string,
}

export function createMsg(text: string, type: Command): Msg {
    return {
        id: uuidv4(),
        text,
        command: type,
        date: new Date().toString(),
    }
}
