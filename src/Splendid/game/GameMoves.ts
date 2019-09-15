import { GameContext, GameState } from "../../Model";
import {
  CollectMultipleResourcesCommand,
  CollectSingleResourceCommand,
  ReserveDevelopmentCardCommand,
  PurchaseDevelopmentCardCommand
} from "ActiveGame/actions";

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
    const cmd = new CollectMultipleResourcesCommand({ resources });
    cmd.execute(G);
  },
  collectSingleResource(G, ctx, resource) {
    console.log(
      `[collectSingleResource] Player ${ctx.currentPlayer} takes 2 ${resource}`
    );
    const cmd = new CollectSingleResourceCommand({ resource });
    cmd.execute(G);
  },
  reserveDevelopmentCard(G, ctx, card) {
    console.log(
      `[reserveDevelopmentCard] Player ${ctx.currentPlayer} takes Card #${card.id}`
    );
    const cmd = new ReserveDevelopmentCardCommand({ card });
    cmd.execute(G);
  },
  purchaseDevelopmentCard(G, ctx, card) {
    console.log(
      `[purchaseDevelopmentCard] Player ${ctx.currentPlayer} takes Card #${card.id}`
    );
    const cmd = new PurchaseDevelopmentCardCommand({ card });
    cmd.execute(G);
  }
};
