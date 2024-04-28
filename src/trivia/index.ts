import { z } from "zod";
import { APIErrorMessages, API_PATH, BASE_URL } from "./constants";
import { APIResponse, APIResponseCode, Category, Difficulty, QuestionStyle, TriviaQuestion, type TriviaAPI } from "./types";

export class Trivia implements TriviaAPI {

    category: Category;
    difficulty: Difficulty;
    questionType: QuestionStyle;
    amount: number;

    constructor(
        category: Category = Category.GeneralKnowledge,
        difficulty: Difficulty = Difficulty.Easy,
        questionType: QuestionStyle = QuestionStyle.Multiple,
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
        const { response_code, results } = APIResponse.parse(json);
        if (response_code !== APIResponseCode.Success) {
            throw new Error(`API Error: ${APIErrorMessages[response_code]}`);
        }
        return z.array(TriviaQuestion).parse(results);
    }

}
