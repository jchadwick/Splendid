import { AI, MCTSBot } from "boardgame.io/ai";
import { MCTSVisualizer } from "boardgame.io/ai-visualize";
import { getAvailableMoves } from "./game/moves";
import { GameState } from "Model";
import { IGameCtx } from "boardgame.io/core";
import { findPlayer } from "../util";
import { AIVisualizer } from "./AIVisualizer";

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
      iterations: 100, // default: 1000
      playoutDepth: 100, // default: 50
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
  enumerate: getAvailableMoves,
  visualize: MCTSVisualizer(AIVisualizer)
});
