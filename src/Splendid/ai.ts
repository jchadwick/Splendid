import { AI, MCTSBot, RandomBot } from "boardgame.io/ai";
import { getAvailableMoves } from "./game/moves";
import {
  GameState,
  Player,
  NativeResourceTypes,
  ResourceTotals,
  ResourceCount
} from "Model";
import { IGameCtx } from "boardgame.io/core";
import { findPlayer, findCurrentPlayer } from "../util";

class Objective {
  weight = 0;

  constructor(
    private readonly multiplier: number,
    private readonly calculateScore: (targetState: GameState) => number
  ) {}

  checker(state: GameState) {
    const score = this.calculateScore(state);
    this.weight = score * this.multiplier;
    return this.weight > 0;
  }
}

class Bot extends MCTSBot {
  constructor(args) {
    super({
      ...args,
      iterations: 100,
      objectives: (
        initialState: GameState,
        ctx: IGameCtx,
        playerId: string
      ) => {
        if (!playerId) return {};

        const player = findPlayer(initialState.players, playerId);
        const initialTokenCount = getTokenCount(player);

        return {
          winGame: new Objective(Number.POSITIVE_INFINITY, g =>
            findPlayer(g.players, playerId).prestigePoints >= 15 ? 1 : 0
          ),
          increasePrestigePoints: new Objective(
            50,
            (targetState: GameState): number =>
              findPlayer(targetState.players, playerId).prestigePoints -
              player.prestigePoints
          ),
          playCard: new Objective(
            5,
            (targetState: GameState): number =>
              findPlayer(targetState.players, playerId).playedCards.length -
              player.playedCards.length
          ),
          getTokens: new Objective(1, (targetState: GameState): number => {
            const targetPlayer = findPlayer(targetState.players, playerId);
            const wildTokens = targetPlayer.tokens.Wild - player.tokens.Wild;
            const tokenCount = getTokenCount(targetPlayer) - initialTokenCount;
            return wildTokens * 3 + tokenCount;
          })
        };
      }
    });
  }
}

const getTokenCount = ({ tokens }: { tokens: ResourceCount }) =>
  NativeResourceTypes.reduce((total, type) => total + tokens[type], 0);

export default AI({
  bot: Bot,
  enumerate: state => {
    const moves = getAvailableMoves(state);
    console.log(
      `purchase: ${
        moves.filter(x => x.move === "purchaseDevelopmentCard").length
      }`
    );
    return moves;
  }
});
