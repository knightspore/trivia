# Trivia Game Engine in Typescript

This is a proof-of-concept for a Trivia engine written in Typescript (Powered by Bun).

As a POC, this project provides a "server" and a "client" to run, communicating via WebSockets.

## Running the example

First, clone the project and install the dependencies:

```bash
gh repo clone knightspore/trivia
cd trivia
bun install
```

Then, start the server:

```bash
bun run devserver
```

Next, you'll start the client:

```bash
bun run devclient
```

This should immediately trigger the server to begin sending messages, which the client will receive and log to the console.

Eg. 

```json
{
    "id": "f8a5427a-5f09-4d83-958a-66b85c60b6aa",
    "question": "In the 1995 film &quot;Balto&quot;, who are Steele&#039;s accomplices?",
    "answers": {
        "A": "Jenna, Sylvie, and Dixie",
        "B": "Nuk, Yak, and Sumac",
        "C": "Kaltag, Nikki, and Star",
        "D": "Dusty, Kirby, and Ralph"
    }
}
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


