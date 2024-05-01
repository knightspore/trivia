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

export type EventFilters = {
    type?: string
    from?: number
    fields?: Record<string, string | number | boolean | null>
}

export function projector<T>(
    log: Event[],
    filters: EventFilters
): Array<TypedEvent<T>> {
    log = log.slice(filters.from ?? 0)
    if (filters.type) {
        log = log.filter((e) => e.type === filters.type)
    }
    if (filters.fields && Object.keys(filters.fields).length > 0) {
        log = log.filter((e) => {
            const keys = Object.keys(filters.fields ?? {});
            for (const k of keys) {
                const data = e.data[k]
                if (data !== filters.fields?.[k]) {
                    return false
                }
                return true
            }
        })
    }
    return log as TypedEvent<T>[]
}

export function printEvent(e: Event): string {
    return `\n// ---[${e.type}]\n`
        + `|| - id: ${e.id}\n`
        + `|| - pos: ${e.position}\n`
        + `|| - date: ${e.date}\n`
        + `|| - data: ${Object.keys(e.data).join(", ")}\n`
        + `\\\\---[${e.type}]\n`
}

export class EventLog implements IEventLog {
    log: Event[]
    position: number

    constructor(log?: Event[], position?: number) {
        this.log = log ?? [] 
        this.position = position ?? 0
    }

    create = <T>(type: string, data: T): Event & { data: T } => {
        const event = newEvent(type, data, this.position)
        this.position += 1
        return event
    }

    push(event: Event) {
        this.log.push(event)
    }

    pos() {
        if (this.log.length !== this.position) throw new Error("EventLog position mismatch")
        return this.log.length
    }

    project<T>(filters?: EventFilters): TypedEvent<T>[] {
        return projector<T>(this.log, filters ?? {})
    }

    printEvent(e: Event): string {
        return printEvent(e)
    }
}


