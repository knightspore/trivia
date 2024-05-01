import { EventLog } from "../event";
import type { IEventLog } from "../event/types";
import { EventTypes, GameConfiguredData, GameQuestionData, PlayerReadyData } from "./types";


interface IGameState extends IEventLog {
    id?: string;
    started_at?: number;
    ended_at?: number;
    configured?: GameConfiguredData;
    ready?: PlayerReadyData;
    score: number;
    total: number;
    questions?: GameQuestionData[];

    lastHydrated?: number;

    hydrate(): void;
}

export class GameState extends EventLog implements IGameState {
    id?: string;
    started_at?: number;
    ended_at?: number;
    configured?: GameConfiguredData;
    ready?: PlayerReadyData;
    score: number;
    total: number;
    questions?: GameQuestionData[];

    lastHydrated?: number;

    constructor() {
        super()
        this.score = 0;
        this.total = 0;
    }

    hydrate(): void {
        const events = this.project();
        for (const event of events) {
            this.lastHydrated = event.position;
            switch (event.type) {
                case EventTypes.GameNew:
                    this.id = event.data.game_id;
                    break;
                case EventTypes.GameConfigured:
                    this.configured = event.data;
                    break;
                case EventTypes.GameStarted:
                    this.started_at = event.date;
                    break;
                case EventTypes.GameDestroyed:
                    this.ended_at = event.date;
                    break;
                case EventTypes.PlayerReady:
                    this.ready = event.data;
                    break;
                case EventTypes.GameQuestion:
                    this.questions = this.questions ?? [];
                    this.questions.push(event.data);
                    break;
                case EventTypes.PlayerAnswer:
                    this.total += 1;
                    this.score += (this.questions?.find((q) => q.question.id === event.data.question_id))
                        ?.question.needle === event.data.answer ? 1 : 0;
                    break;
            }
        }
    }

}
