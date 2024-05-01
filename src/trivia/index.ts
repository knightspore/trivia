import { z } from "zod";
import { APIResponse, APIResponseCode, Category, Difficulty, QuestionFormat, TriviaQuestion, type ITrivia } from "./types";

export class Trivia implements ITrivia {

    category: Category;
    difficulty: Difficulty;
    questionType: QuestionFormat;
    amount: number;

    constructor(
        category?: Category,
        difficulty?: Difficulty,
        questionType?: QuestionFormat,
        amount?: number
    ) {
        this.category = category ?? Category.GeneralKnowledge;
        this.difficulty = difficulty ?? Difficulty.Easy;
        this.questionType = questionType ?? QuestionFormat.Multiple;
        this.amount = amount ?? 10;
    }

    url(): URL {
        const url = new URL("https://opentdb.com");
        url.pathname = "/api.php";
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
                throw new Error(
                    {
                        0: "Success",
                        1: "No Results",
                        2: "Invalid Parameter",
                        3: "Token Not Found",
                        4: "Token Empty",
                        5: "Undocumented Error"
                    }[response_code]
                    ?? `Unknown Error: ${response_code}`
                );
            }
            return z.array(TriviaQuestion).parse(results);
        } catch (e) {
            throw new Error(`API Error: ${e}`);
        }
    }

}
