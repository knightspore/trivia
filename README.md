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

## Running the Example Game

Currently, the example is a simple single-player experience (open a pull request if you're interested in changing that!). It's a basic round of Trivia, with a live projection of the game state and event log so you can observe the events being logged, and corresponding state being updated as you play. 

```bash
gh repo clone knightspore/trivia
cd trivia
bun install
bun run example
```

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
```

<!-- TODO Finish -->


