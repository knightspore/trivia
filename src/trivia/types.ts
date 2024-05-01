import { z } from "zod";

export enum Category {
    GeneralKnowledge = 9,
    Books,
    Film,
    Music,
    Theatre,
    Tevelision,
    VideoGames,
    BoardGames,
    Science,
    Computers,
    Mathematics,
    Mythology,
    Sports,
    Geography,
    History,
    Politics,
    Art,
    Celebrities,
    Animals,
    Vehichles,
    Comics,
    Gadgets,
    Anime,
    Cartoons,
}

export enum Difficulty {
    Easy = "easy",
    Medium = "medium",
    Hard = "hard",
}

export enum QuestionFormat {
    Multiple = "multiple",
    Boolean = "boolean",
}

export enum APIResponseCode {
    Success = 0,
    NoResults = 1,
    InvalidParameter = 2,
    TokenNotFound = 3,
    TokenEmpty = 4,
    Unknown = 5
}

type APIResult = z.infer<typeof APIResult>
const APIResult = z.object({
    type: z.string(),
    difficulty: z.string(),
    category: z.string(),
    question: z.string(),
    correct_answer: z.string(),
    incorrect_answers: z.array(z.string())
});

export type APIResponse = z.infer<typeof APIResponse>
export const APIResponse = z.object({
    response_code: z.nativeEnum(APIResponseCode),
    results: z.array(APIResult)
});

export type TriviaQuestion = z.infer<typeof TriviaQuestion>
export const TriviaQuestion = APIResult.transform((q) => {
    const haystack = [...q.incorrect_answers, q.correct_answer]
        .map((v) => ({ v, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ v }) => v);

    const needle = haystack.indexOf(q.correct_answer);

    return {
        id: crypto.randomUUID(),
        needle,
        haystack,
        ...q,
    }
})

export interface ITrivia {
    category: Category;
    difficulty: Difficulty;
    questionType: QuestionFormat;
    amount: number;
    url(): URL;
    getQuestions(): Promise<TriviaQuestion[]>;
}
