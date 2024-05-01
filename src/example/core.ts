import { EventLog } from "../event";
import type { IEventLog, TypedEvent } from "../event/types";
import { GameConfiguredData, GameDestroyedData, GameNewData, GameQuestionData, GameStartedData, PlayerAnswerData, PlayerReadyData } from "./types";


interface IGameState extends IEventLog {
    id?: string;
    started_at?: string;
    ended_at?: string;
    configured?: GameConfiguredData;
    ready?: PlayerReadyData;
    score: number;
    total: number;
    questions?: GameQuestionData[];

    playerReadyEvent(data: PlayerReadyData, position: number): void;
    playerAnswerEvent(data: PlayerAnswerData, position: number): void;
    gameNewEvent(data: GameNewData, position: number): void;
    gameConfiguredEvent(data: GameConfiguredData, position: number): void;
    gameStartedEvent(data: GameStartedData, position: number): void;
    gameQuestionEvent(data: GameQuestionData, position: number): void;
    gameDestroyedEvent(data: GameDestroyedData, position: number): void;

    playerReadyProjector(): TypedEvent<PlayerReadyData>[];
    playerAnswerProjector(): TypedEvent<PlayerAnswerData>[];
    gameNewProjector(): TypedEvent<GameNewData>[];
    gameConfiguredProjector(): TypedEvent<GameConfiguredData>[];
    gameStartedProjector(): TypedEvent<GameStartedData>[];
    gameQuestionProjector(): TypedEvent<GameQuestionData>[];
    gameDestroyedProjector(): TypedEvent<GameDestroyedData>[];

    gameStateProjector(): any;
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

    // Events

    playerReadyEvent(data: PlayerReadyData, position: number): void {
        this.push(this.newEvent("player-ready", data, position))
    }

    playerAnswerEvent(data: PlayerAnswerData, position: number): void {
        this.push(this.newEvent("player-answer", data, position))
    }

    gameNewEvent(data: GameNewData, position: number): void {
        this.push(this.newEvent("game-new", data, position))
    }

    gameConfiguredEvent(data: GameConfiguredData, position: number): void {
        this.push(this.newEvent("game-configured", data, position))
    }

    gameStartedEvent(data: GameStartedData, position: number): void {
        this.push(this.newEvent("game-started", data, position))
    }

    gameQuestionEvent(data: GameQuestionData, position: number): void {
        this.push(this.newEvent("game-question", data, position))
    }

    gameDestroyedEvent(data: GameDestroyedData, position: number): void {
        this.push(this.newEvent("game-destroyed", data, position))
    }

    // Projectors 

    playerReadyProjector(pos?: number): TypedEvent<PlayerReadyData>[] {
        return this.projector("player-ready", pos ?? 0)
    }

    playerAnswerProjector(pos?: number): TypedEvent<PlayerAnswerData>[] {
        return this.projector("player-answer", pos ?? 0)
    }

    gameNewProjector(pos?: number): TypedEvent<GameNewData>[] {
        return this.projector("game-new", pos ?? 0)
    }

    gameConfiguredProjector(pos?: number): TypedEvent<GameConfiguredData>[] {
        return this.projector("game-configured", pos ?? 0)
    }

    gameStartedProjector(pos?: number): TypedEvent<GameStartedData>[] {
        return this.projector("game-started", pos ?? 0)
    }

    gameQuestionProjector(pos?: number): TypedEvent<GameQuestionData>[] {
        return this.projector("game-question", pos ?? 0)
    }

    gameDestroyedProjector(pos?: number): TypedEvent<GameDestroyedData>[] {
        return this.projector("game-destroyed", pos ?? 0)
    }

    gameStateProjector(): any {
        const game: Record<string, any> = {};

        this.gameNewProjector()
            .forEach(event => {
                game.id = event.data.game_id;
                game.lastPosition = event.position;
            });

        this.gameConfiguredProjector()
            .forEach(event => {
                game.configured = event.data.config;
                game.lastPosition = event.position;
            });

        this.playerReadyProjector()
            .forEach(event => {
                game.ready = event.data;
                game.lastPosition = event.position;
            });

        this.gameStartedProjector()
            .forEach(event => {
                game.started_at = event.date;
                game.lastPosition = event.position;
            });

        this.gameQuestionProjector()
            .forEach(event => {
                game.lastPosition = event.position;
                game.total = (game.total ?? 0) + 1;
                game.questions.push(event.data);
            });

        this.playerAnswerProjector()
            .forEach(event => {
                game.lastPosition = event.position;
                game.score += 1;
            });

        this.gameDestroyedProjector()
            .forEach(event => {
                game.ended_at = event.date;
                game.lastPosition = event.position;
            });

    }

}
