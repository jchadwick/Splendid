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

const executeCommand = (
  state: GameState,
  ctx: GameContext,
  CommandType,
  args?
) => {
  console.log(
    `Player ${ctx.currentPlayer} executes ${
      CommandType.name
    } with ${JSON.stringify(args)}`
  );
  const cmd = new CommandType(args);
  cmd.execute(state);
};

export const moves: { [key: string]: GameActionHandler } = {
  collectMultipleResources(G, ctx, resources) {
    executeCommand(G, ctx, CollectMultipleResourcesCommand, { resources });
  },
  collectSingleResource(G, ctx, resource) {
    executeCommand(G, ctx, CollectSingleResourceCommand, { resource });
  },
  reserveDevelopmentCard(G, ctx, card) {
    executeCommand(G, ctx, ReserveDevelopmentCardCommand, { card });
  },
  purchaseDevelopmentCard(G, ctx, card) {
    executeCommand(G, ctx, PurchaseDevelopmentCardCommand, { card });
  }
};
