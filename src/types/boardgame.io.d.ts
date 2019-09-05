declare module "boardgame.io/ui" {
  import * as React from "react";
  interface ITokenCoord {
    x: number;
    y: number;
    originalX?: number;
    originalY?: number;
  }
  interface ITokenProps {
    x?: number;
    y?: number;
    z?: number;
    style?: React.CSSProperties;
    animate?: boolean;
    draggable?: boolean;
    shouldDrag?: (coord: ITokenCoord) => boolean;
    onDrag?: (coord: ITokenCoord) => void;
    onDrop?: (coord: ITokenCoord) => void;
    onClick?: (coord: ITokenCoord) => void;
    children?: any;
    animationDuration?: number;
    square?: string;
  }
  export class Token extends React.Component<ITokenProps, any> {}
  interface IGridColorMap {
    [key: string]: string;
  }
  interface IGridProps {
    rows: number;
    cols: number;
    outline?: boolean;
    style?: React.CSSProperties;
    colorMap?: IGridColorMap;
    cellSize?: number;
    onClick: (coords: any) => void;
    children?: any;
  }
  export class Grid extends React.Component<IGridProps, any> {}
}

declare module "boardgame.io/core" {
  export namespace TurnOrder {
    const DEFAULT: ITurnOrder;
    const ONCE: ITurnOrder;
    const ANY: ITurnOrder;
    const ANY_ONCE: ITurnOrder;
    const OTHERS: ITurnOrder;
    const OTHERS_ONCE: ITurnOrder;
    const CUSTOM: (playOrder: any) => ITurnOrder;
    const CUSTOM_FROM: (playOrderField: string) => ITurnOrder;
  }

  export class FlowObj<TGameState> {
    ctx: (players: number) => any;
    processGameEvent: (state: TGameState, gameEvent: any) => any;
  }
  export class GameObj<TGameState> {
    processMove: (G: TGameState, action: any, ctx: any) => any;
    flow: FlowObj<TGameState>;
  }
  export class Random {
    Shuffle: (deck: any[]) => any[];
    Number: () => number;
    Die: (spotvalue: number, diceCount: number) => number;
    D4: () => number;
    D6: () => number;
    D8: () => number;
    D10: () => number;
    D12: () => number;
    D20: () => number;
  }
  export class Events {
    endTurn: () => void;
    endPhase: () => void;
    endGame: (gameover?: any) => void;
  }
  interface IGameCtx {
    phase?: string;
    playerID?: string;
    numPlayers: number;
    turn: number;
    currentPlayer: string;
    currentPlayerMoves: number;
    actionPlayers: string[];
    playOrder: string[];
    playOrderPos: number;
    gameover: any;
    stats: IGameStats;
    random: Random;
    events: Events;
  }

  interface IGameMoves<TGameState> {
    [key: string]: (G: TGameState, ctx: IGameCtx, ...args: any[]) => any;
  }

  interface IActionPlayers<TGameState> {
    value: (G: TGameState, ctx: IGameCtx) => number[] | string[];
    all: boolean;
    others: boolean;
    once: boolean;
  }

  interface ITurnOrder<TGameState = any> {
    playOrder?: (G: TGameState, ctx: IGameCtx) => number[] | string[];
    first: (G: TGameState, ctx: IGameCtx) => number;
    next: (G: TGameState, ctx: IGameCtx) => number;
    actionPlayers?: IActionPlayers<TGameState>;
  }

  interface IGameFlowPhases<TGameState> {
    [name: string]: {
      movesPerTurn?: number;
      turnOrder?: ITurnOrder;
      next?: string;
      allowedMoves?: string[];
      endPhaseIf?: (G: TGameState, ctx: IGameCtx) => boolean | object;
      onPhaseBegin?: (G: TGameState, ctx: IGameCtx) => any;
      onPhaseEnd?: (G: TGameState, ctx: IGameCtx) => any;
      endTurnIf?: (G: TGameState, ctx: IGameCtx) => boolean | object;
      endGameIf?: (G: TGameState, ctx: IGameCtx) => void;
      onTurnBegin?: (G: TGameState, ctx: IGameCtx) => any;
      onTurnEnd?: (G: TGameState, ctx: IGameCtx) => any;
      onMove?: (G: TGameState, ctx: IGameCtx) => any;
    };
  }

  interface IGameFlowTrigger<TGameState> {
    conditon: (G: TGameState, ctx: IGameCtx) => boolean;
    action: (G: TGameState, ctx: IGameCtx) => any;
  }

  interface IGameFlow<TGameState> {
    startingPhase?: string;
    movesPerTurn?: number;
    endTurn?: boolean;
    endPhase?: boolean;
    endGame?: boolean;
    endTurnIf?: (G: TGameState, ctx: IGameCtx) => boolean | object;
    endGameIf?: (G: TGameState, ctx: IGameCtx) => void;
    onTurnBegin?: (G: TGameState, ctx: IGameCtx) => any;
    onTurnEnd?: (G: TGameState, ctx: IGameCtx) => any;
    onMove?: (G: TGameState, ctx: IGameCtx) => any;
    triggers?: IGameFlowTrigger<TGameState>[];
    phases?: IGameFlowPhases<TGameState>;
    turnOrder?: ITurnOrder;
  }
  interface IGameArgs<TGameState> {
    name?: string;
    setup: (initialState: Partial<TGameState> & Partial<IGameCtx>) => any;
    moves: IGameMoves;
    playerView?: (G: TGameState, ctx: IGameCtx, playerID: string) => any;
    flow?: IGameFlow;
    seed?: string;
  }

  export function Game<TGameState = any>(
    gameArgs: IGameArgs<TGameState>
  ): GameObj;

  export const INVALID_MOVE: string;

  export const PlayerView: {
    STRIP_SECRETS: <TGameState = any>(
      G: TGameState,
      ctx: IGameCtx,
      playerID: any
    ) => any;
  };

  interface IGameStats {
    turn: IStats;
    phase: IStats;
  }

  interface IStats {
    numMoves: IMoveStats;
    allPlayed: true;
  }

  interface IMoveStats {
    [key: string]: number;
  }
}

declare module "boardgame.io/react" {
  import { GameObj, IGameMoves, IGameCtx, IGameArgs } from "boardgame.io/core";
  export class WrapperBoard {
    moves: any;
    events: any;
    store: any;
    updatePlayerID: (id: string) => void;
  }
  interface IClientArgs {
    game: any;
    numPlayer?: number;
    board?: React.ReactNode;
    multiplayer?: boolean;
    debug?: boolean;
    enhancer?: any;
  }
  export function Client(
    clientArgs: IClientArgs
  ): React.ComponentType & WrapperBoard;

  export interface IBoardProps<TGameState = any> {
    G: TGameState;
    ctx: IGameCtx;
    moves: { [key: string]: (...args) => void };
    playerID: string;
    gameArgs?: IGameArgs;
    credentials?: any;
    events: {
      endTurn(playerId?: string): void;
      endPhase?(phase?: string): void;
      endGame?(gameover?: any): void;
    };
    gameID: string;
    isActive: boolean;
    isConnected: boolean;
    isMultiplayer: boolean;
    log: string[];
    redo: () => void;
    reset: () => void;
    step: () => Promise<void>;
    undo: () => void;
  }
}

declare module "boardgame.io/client" {
  import { GameObj, IGameMoves } from "boardgame.io/core";
  export class WrapperBoard {
    moves: any;
    events: any;
    store: any;
    updatePlayerID: (id: string) => void;
    step: () => void;
  }
  interface IClientArgs {
    game: any;
    numPlayer?: number;
    board?: React.ReactNode;
    multiplayer?: boolean;
    debug?: boolean;
    enhancer?: any;
    ai?: any;
  }
  export function Client(clientArgs: IClientArgs): WrapperBoard;
}

declare module "boardgame.io/server" {
  import { GameObj } from "boardgame.io/core";
  import * as Koa from "koa";
  interface IServerArgs {
    games: GameObj[];
  }
  function Server(serverArgs: IServerArgs): Koa;
  export = Server;
}

declare module "boardgame.io/ai";
