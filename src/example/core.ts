import { EventLog } from "../event";
import type { IEventLog } from "../event/types";
import { GameConfiguredData, GameQuestionData, PlayerReadyData } from "./types";


interface IGameState extends IEventLog {
    id?: string;
    started_at?: string;
    ended_at?: string;
    configured?: GameConfiguredData;
    ready?: PlayerReadyData;
    score: number;
    total: number;
    questions?: GameQuestionData[];
}

export class GameState extends EventLog implements IGameState {
    id?: string;
    started_at?: string;
    ended_at?: string;
    configured?: GameConfiguredData;
    ready?: PlayerReadyData;
    score: number;
    total: number;
    questions?: GameQuestionData[];

    constructor() {
        super()
        this.score = 0;
        this.total = 0;
    }
}
