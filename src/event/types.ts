import { z } from "zod"

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
    newEvent<T>(type: string, data: T, position: number): Event & { data: T }
    push(event: Event): void
    pos(): number
    projector<T>(type: string, position: number): Array<TypedEvent<T>>
    printEvent(e: Event): string
}

