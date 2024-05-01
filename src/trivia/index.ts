import { z } from "zod";
import { APIErrorMessages, API_PATH, BASE_URL } from "./constants";
import { APIResponse, APIResponseCode, Category, Difficulty, QuestionStyle, TriviaQuestion, type ITrivia } from "./types";

export class Trivia implements ITrivia {

    category: Category;
    difficulty: Difficulty;
    questionType: QuestionStyle;
    amount: number;

    constructor(
        category?: Category,
        difficulty?: Difficulty,
        questionType?: QuestionStyle,
        amount?: number
    ) {
        this.category = category ?? Category.GeneralKnowledge;
        this.difficulty = difficulty ?? Difficulty.Easy;
        this.questionType = questionType ?? QuestionStyle.Multiple;
        this.amount = amount ?? 10;
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
        try {
            const { response_code, results } = APIResponse.parse(json);
            if (response_code !== APIResponseCode.Success) {
                throw new Error(`API Error: ${APIErrorMessages[response_code]}`);
            }
            return z.array(TriviaQuestion).parse(results);
        } catch (e) {
            throw new Error(`API Error: ${e}`);
        }
    }

}
