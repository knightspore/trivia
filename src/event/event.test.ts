import { describe, it, expect } from "bun:test"
import { EventLog } from "./"

const log = new EventLog()
const event = log.create("type-a", { test: "hello" })
log.push(event)
log.push(log.create("type-b", { test: "world" }))
log.push(log.create("type-b", { test: "again" }))

describe("EventLog", () => {

    it("newEvent should create a new event", () => {
        expect(event.id).toBeDefined()
        expect(event.date).toBeDefined()
        expect(event.type).toBe("type-a")
        expect(event.data).toEqual({ test: "hello" })
        expect(event.position).toBe(0)
    })

    it("projector should filter by fields", () => {
        const events = log.project({ fields: { test: "again" } })

        expect(events.length).toBe(1)
        expect(events[0].type).toBe("type-b")
        expect(events[0].data.test).toBe("again")
    })

    it("projector should filter by type", () => {
        const events = log.project({ type: "type-a" })

        expect(events.length).toBe(1)
        expect(events[0].type).toBe("type-a")
    })

    it("projector should filter by from", () => {
        const events = log.project({ from: 1 })

        expect(events.length).toBe(2)
        expect(events[0].type).toBe("type-b")
        expect(events[1].type).toBe("type-b")
    })

    it("projector should filter by multiple filters", () => {
        const events = log.project({
            type: "type-b",
            fields: { test: "world" },
            from: 1
        })

        expect(events.length).toBe(1)
        expect(events[0].type).toBe("type-b")
        expect(events[0].data.test).toBe("world")
    })

})
