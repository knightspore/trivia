import { z } from "zod"
import type { EventFilters } from ".";

export type Event = z.infer<typeof Event>
export const Event = z.object({
    id: z.string().uuid(),
    date: z.number(),
    type: z.string(),
    data: z.any(),
    position: z.number(),
}).transform((msg) => {
    return {
        ...msg,
    }
})

export type TypedEvent<T> = Event & { data: T };

export interface IEventLog {
    log: Event[]
    position: number
    create<T>(type: string, data: T, position: number): Event & { data: T }
    push(event: Event): void
    pos(): number
    project<T>(filters?: EventFilters): Array<TypedEvent<T>>
    printEvent(e: Event): string
}

