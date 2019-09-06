import { GameContext, GameState } from "../model";

export type Moves = { [key in keyof typeof moves]: (...args) => void };

interface GameActionHandler {
  (G: GameState, ctx: GameContext, ...args): any;
}

export const moves: { [key: string]: GameActionHandler } = {
  collectMultipleResources(G, ctx, resources) {
    console.log(
      `[collectMultipleResources] Player ${
        ctx.currentPlayer
      } takes ${resources.join(", ")}`
    );
  },
  collectSingleResource(G, ctx, resource) {
    console.log(
      `[collectSingleResource] Player ${ctx.currentPlayer} takes 2 ${resource}`
    );
  },
  reserveDevelopmentCard(G, ctx, card) {
    console.log(
      `[reserveDevelopmentCard] Player ${ctx.currentPlayer} takes Card #${card.id}`
    );
  },
  purchaseDevelopmentCard(G, ctx, card) {
    console.log(
      `[purchaseDevelopmentCard] Player ${ctx.currentPlayer} takes Card #${card.id}`
    );
  }
};
