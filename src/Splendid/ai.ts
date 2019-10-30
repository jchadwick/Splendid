import { AI, MCTSBot } from "boardgame.io/ai";
import { IGameCtx } from "boardgame.io/core";
import { GameState } from "Model";
import { findPlayer } from "../util";
import { getAvailableMoves } from "./game/moves";

const objective = (
  multiplier: number,
  calculateScore: (targetState: GameState) => number
) => ({
  weight: 0,
  checker: function(state: GameState) {
    const score = calculateScore(state);
    this.weight = score * multiplier;
    return this.weight > 0;
  }
});

class Bot extends MCTSBot {
  constructor(args) {
    super({
      ...args,
      iterations: (_, ctx: IGameCtx) => 100 + ctx.turn * 2,
      playoutDepth: (_, ctx: IGameCtx) => 50,
      objectives: function(
        initialState: GameState,
        _: IGameCtx,
        playerId: string
      ) {
        if (!playerId) return {};

        const player = findPlayer(initialState.players, playerId);

        return {
          winGame: objective(
            Number.POSITIVE_INFINITY,
            (targetState: GameState): number =>
              findPlayer(targetState.players, playerId).prestigePoints >= 15
                ? 1
                : 0
          ),
          increasePrestigePoints: objective(
            50,
            (targetState: GameState): number =>
              findPlayer(targetState.players, playerId).prestigePoints -
              player.prestigePoints
          )
        };
      }
    });
  }
}

export default AI({
  bot: Bot,
  enumerate: getAvailableMoves
});
