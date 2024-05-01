import { Event, type IEventLog, type TypedEvent } from "./types"

export function newEvent<T>(
    type: string,
    data: T,
    position: number
): Event & { data: T } {
    const id = crypto.randomUUID()
    const date = new Date().getTime()
    return Event.parse({ id, date, type, data, position }) as unknown as Event & { data: T }
}

export function projector<T>(
    log: Event[],
    type: string,
    position: number = 0
): Array<TypedEvent<T>> {
    return log.slice(position).filter((e) => e.type === type) as TypedEvent<T>[]
}

export class EventLog implements IEventLog {
    log: Event[]
    position: number

    constructor() {
        this.log = [] as Event[]
        this.position = 0
    }

    newEvent<T>(type: string, data: T, position: number): Event & { data: T } {
        return newEvent(type, data, position)
    }

    push(event: Event) {
        this.log.push(event)
    }

    pos() {
        return this.log.length
    }

    projector<T>(type: string, position: number): TypedEvent<T>[] {
        return projector<T>(this.log, type, position)
    }

    printEvent(e: Event): string {
        return `\n// ---[${e.type}]\n`
            + `|| - id: ${e.id}\n`
            + `|| - pos: ${e.position}\n`
            + `|| - date: ${e.date}\n`
            + `|| - data: ${Object.keys(e.data).join(", ")}\n`
            + `\\\\---[${e.type}]\n`
    }
}

