import { v4 as uuidv4 } from "uuid"

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

type Difficulty = "easy" | "medium" | "hard";
type QuestionType = "multiple" | "boolean";

enum ResponseCode {
    Success = 0,
    NoResults,
    InvalidParameter,
    TokenNotFound,
    TokenEmpty,
}

type APIResponse = {
    response_code: ResponseCode;
    results: Array<TriviaQuestion>;
};

export type TriviaQuestion = {
    id: string;
    category: Category;
    type: QuestionType;
    difficulty: Difficulty;
    question: string;
    correct_answer: string;
    incorrect_answers: Array<string>;
};

export enum Param {
    Amount = "amount",
    Category = "category",
    Difficulty = "difficulty",
    QuestionType = "type"
}

export const BASE_URL = new URL("/api.php", "https://opentdb.com")

type Value<T> = T extends Param.Amount ? number :
    T extends Param.Category ? Category :
    T extends Param.Difficulty ? Difficulty :
    QuestionType;

export function addParam<T>(url: URL, key: Param, value: Value<T>) {
    if (!url.searchParams.get(key)) {
        url.searchParams.append(`${key}`, `${value}`)
    }
}

export async function getQuestions(url: URL): Promise<Array<TriviaQuestion> | null> {
    const res = await fetch(url.toString());
    const data: APIResponse = await res.json();
    if (data.response_code > 0) {
        return null
    }
    return data.results.map((r) => { return { ...r, id: uuidv4() } });
}
