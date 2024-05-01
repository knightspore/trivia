import { describe, it, expect } from "bun:test"
import { Trivia } from "."
import { Category, Difficulty, QuestionFormat, TriviaQuestion } from "./types";

describe("Trivia", () => {

    const trivia = new Trivia();

    it("should initialize with default params", () => {
        expect(trivia).toBeInstanceOf(Trivia);
        expect(trivia.category).toBe(Category.GeneralKnowledge);
        expect(trivia.difficulty).toBe(Difficulty.Easy);
        expect(trivia.questionType).toBe(QuestionFormat.Multiple);
        expect(trivia.amount).toBe(10);
    })

    it("url() should create URL from configuration", () => {
        const url = trivia.url();
        expect(url).toBeInstanceOf(URL);
        expect(url.toString())
            .toBe(`https://opentdb.com/api.php?amount=10&category=9&difficulty=easy&type=multiple`);
    })

    it("getQuestions() should get questions", async () => {
        const questions = await trivia.getQuestions();
        expect(questions).toHaveLength(10);
        expect(TriviaQuestion.array().parse(questions)).toBeInstanceOf(Array);

        const [question] = questions;
        expect(question.type).toBe(QuestionFormat.Multiple) 
        expect(question.category).toBe("General Knowledge")
        expect(question.difficulty).toBe(Difficulty.Easy)

    })

})
