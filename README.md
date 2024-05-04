# Trivia Game Experiments in Typescript

This is an experiment / proof-of-concept for a Trivia game written in Typescript (Powered by Bun). 

It consists of: 

- Trivia - A Game Engine (using the Open Trivia Database API)
- Event - A simple event system (with a log, and projector)
- Example - A simple example game using React (as well as tests showing a simple game loop)

```bash
src/
├── event/
│   ├── event.test.ts
│   ├── index.ts
│   └── types.ts
├── example/
│   ├── core.ts
│   ├── example-react-app/
│   ├── example.test.ts
│   ├── index.ts
│   └── types.ts
└── trivia/
    ├── index.ts
    ├── trivia.test.ts
    └── types.ts
```

## Why event sourcing? 

This idea was initially an exploration into creating a trivia game for Twitch streamers, where they can play with their chat. In this case, the approach of separating the game state from the game logic seemed a good fit. I've worked with CQRS before, and the experience of "replaying" the log to construct the current state was very appealing, in terms of syncing the game state across clients.

In practice, the trivia and event modules could be packaged into whatever sort of server - client relationship you want to build. Most obvious would be a Websocket server, but you could also use a REST API, or even a serverless function (given that writes and reads are separate).

Special shoutout to [Oskar Dudycz's notes on Event Sourcing in Node](https://github.com/oskardudycz/EventSourcing.NodeJS?tab=readme-ov-file#what-is-event) for some great reading material on the subject.

## Running the Tests

It's worth noting that the OpenTDB has a rate limit which can be easily avoided using Bun's test filtering.

There are three tests - `trivia`, `event`, and `example` - and these can simply be appended to `bun test` to run each suite separately.

```bash
bun test trivia
bun test event
bun test example
```

## How it works

The game uses a Trivia API from [Open Trivia Database](https://opentdb.com/), which usefully offers parameters such as Cateogory, Difficulty and Question Types to fetch and prepare data for the game.

```typescript 
export type TriviaQuestion = {
    id: string;
    category: Category;
    type: QuestionType;
    difficulty: Difficulty;
    question: string;
    correct_answer: string;
    incorrect_answers: Array<string>;
};

// Usage

const trivia = new Trivia(category, difficulty, type, amount);
const question = await trivia.getQuestions();
```

Orchestrating the instantiation, configuration and question fetching is the Event Sourcing system, which comprises a few components. 

Events are the main data structure, holding the metadata for each event (making it possible to replay them), as well as the game data for re-hydration.

```typescript
type Event = {
    id: string;
    position: string;
    type: string;
    date: number;
    data: any; // Event data goes here
}

// Extending in-practice for your domain
type TypedEvent<T> = Event & {
    data: T;
}
```

Next, we have the Event Log (and projector). This is a simple array of events, which can be pushed to, and hydrated from. 

```typescript
export interface IEventLog {
    log: Event[]
    position: number
    create<T>(type: string, data: T, position?: number): Event & { data: T }
    push(event: Event): void
    pos(): number
    project<T>(filters?: EventFilters): Array<TypedEvent<T>>
    printEvent(e: Event): string
}

// Usage

const log = new EventLog();

log.push(log.create({ id: 1, type: "apple" }));
log.push(log.create({ id: 2, type: "pear" }));

const appleEvents = log.project({ type: "apple" });
console.log(appleEvents); // [ { id: 1, type: "apple" } ]

const pearEvents = log.project({ type: "pear" }); 
console.log(pearEvents); // [ { id: 2, type: "pear" } ]
```

As you can see, the event system is extensible, and easy to modify re-use in a custom implementation, eg. Redis, a database, or a file system.

## In-Practice: an Example Game

Exploring this project interactively.

### An example game described as a series of Tests

The first example game is `src/example/example.test.ts`. This uses a class `IGameState` in `src/example/core.ts`, which extends `IEventLog` to add a number of fields to populate (ie. the "Game State"), as well as a `hydrate` method which runs the entire projection, reconstructing game state values such as `started_at`, `score`, `total`, etc.

Stepping through this test is a great reference for using these modules to implement your own game logic elsewhere.

### An example game implemented as a React App

Currently, the example is a simple single-player experience (open a pull request if you're interested in changing that!). It's a basic round of Trivia, with a live projection of the game state and event log so you can observe the events being logged, and corresponding state being updated as you play. 

```bash
gh repo clone knightspore/trivia
cd trivia
bun install
bun run example
```
