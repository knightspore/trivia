export enum TriviaCategory {
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

type Amount = number;

type Category = TriviaCategory;

type Difficulty = "easy" | "medium" | "hard";

type MultipleQuestion = "multiple";
type TrueFalseQuestion = "boolean";
type QuestionType = MultipleQuestion | TrueFalseQuestion;

type RequestTokenCommand = "request";
type ResetTokenCommand = "reset";
type Command = RequestTokenCommand | ResetTokenCommand;
type Token = string;

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

type TriviaQuestion = {
  category: string;
  type: QuestionType;
  difficulty: Difficulty;
  question: string;
  correct_answer: string;
  incorrect_answers: Array<string>;
};

type NextQuestion = {
  value: TriviaQuestion | undefined;
  done: boolean;
};

export class TriviaAPI {
  private base_url: URL;
  private questions: Array<TriviaQuestion>;

  constructor() {
    this.base_url = new URL("/api.php", "https://opentdb.com");
    this.questions = [];
  }

  url() {
    return this.base_url.toString();
  }

  async get(): Promise<TriviaAPI> {
    const res = await fetch(this.base_url.toString());
    const data: APIResponse = await res.json();
    if (data.response_code > 0) {
      throw new Error(`Error: ${ResponseCode[data.response_code]}`);
    }
    this.questions = data.results;
    return this;
  }

  *startRound() {
    let i = 0;
    while (i < this.questions.length) {
      yield this.questions[(i += 1)];
    }
  }

  amount(value: Amount): TriviaAPI {
    this.base_url.searchParams.append("amount", `${value}`);
    return this;
  }

  category(value: Category): TriviaAPI {
    this.base_url.searchParams.append("category", `${value}`);
    return this;
  }

  difficulty(value: Difficulty): TriviaAPI {
    this.base_url.searchParams.append("difficulty", `${value}`);
    return this;
  }

  type(value: QuestionType): TriviaAPI {
    this.base_url.searchParams.append("type", `${value}`);
    return this;
  }
}
