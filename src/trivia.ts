import { z } from "zod";

const BASE_URL = "https://opentdb.com"
const API_PATH = "/api.php"

export enum CategoryID {
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

export enum CategoryEnum {
    GeneralKnowledge = "General Knowledge",
    Books = "Books",
    Film = "Film",
    Music = "Music",
    Theatre = "Theatre",
    Television = "Television",
    VideoGames = "Video Games",
    BoardGames = "Board Games",
    Science = "Science",
    Computers = "Computers",
    Mathematics = "Mathematics",
    Mythology = "Mythology",
    Sports = "Sports",
    Geography = "Geography",
    History = "History",
    Politics = "Politics",
    Art = "Art",
    Celebrities = "Celebrities",
    Animals = "Animals",
    Vehicles = "Vehicles",
    Comics = "Comics",
    Gadgets = "Gadgets",
    Anime = "Anime",
    Cartoons = "Cartoons"
}

export type Difficulty = z.infer<typeof Difficulty>
export const Difficulty = z.union([z.literal("easy"), z.literal("medium"), z.literal("hard")]);

export type QuestionStyle = z.infer<typeof QuestionStyle>
export const QuestionStyle = z.union([z.literal("multiple"), z.literal("boolean")]);

export enum APIResponseCodeEnum {
    Success = 0,
    NoResults = 1,
    InvalidParameter = 2,
    TokenNotFound = 3,
    TokenEmpty = 4
}

export const APIErrorMessage = {
    0: "Success",
    1: "No Results",
    2: "Invalid Parameter",
    3: "Token Not Found",
    4: "Token Empty"
}

export type APIResult = z.infer<typeof APIResult>
export const APIResult = z.object({
    type: z.string(),
    difficulty: z.string(),
    category: z.string(),
    question: z.string(),
    correct_answer: z.string(),
    incorrect_answers: z.array(z.string())
});

export type APIResponse = z.infer<typeof APIResponse>
export const APIResponse = z.object({
    response_code: z.nativeEnum(APIResponseCodeEnum),
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

interface TriviaAPI {
    category: CategoryID;
    difficulty: Difficulty;
    questionType: QuestionStyle;
    amount: number;
}

export class Trivia implements TriviaAPI {

    category: CategoryID;
    difficulty: Difficulty;
    questionType: QuestionStyle;
    amount: number;

    constructor(
        category: CategoryID = 9,
        difficulty: Difficulty = "easy",
        questionType: QuestionStyle = "multiple",
        amount: number = 10
    ) {
        this.category = category;
        this.difficulty = difficulty;
        this.questionType = questionType;
        this.amount = amount;
    }

    url(): URL {
        const url = new URL(BASE_URL);
        url.pathname = API_PATH;
        url.searchParams.append("amount", this.amount.toString());
        url.searchParams.append("category", this.category.toString());
        url.searchParams.append("difficulty", this.difficulty);
        url.searchParams.append("type", this.questionType);
        return url;
    }

    async getQuestions() {
        const res = await fetch(this.url().toString());
        const json = await res.json();
        const { response_code, results }: APIResponse = APIResponse.parse(json);
        if (response_code !== APIResponseCodeEnum.Success) {
            throw new Error(`API Error: ${APIErrorMessage[response_code]}`);
        }
        return z.array(TriviaQuestion).parse(results);
    }

}
