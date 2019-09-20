import { GameContext, GameState } from "../../Model";
import {
  CollectMultipleResourcesCommand,
  CollectSingleResourceCommand,
  ReserveDevelopmentCardCommand,
  PurchaseDevelopmentCardCommand
} from "ActiveGame/actions";
import { PlayerActionCommand } from "ActiveGame/actions/PlayerAction";

export type Moves = { [key in keyof typeof moves]: (...args) => void };

interface GameActionHandler {
  (G: GameState, ctx: GameContext, ...args): GameState;
}

const executeCommand = (
  state: GameState,
  ctx: GameContext,
  CommandType: { new (...args): PlayerActionCommand },
  args?
): GameState => {
  console.log(
    `Player ${ctx.currentPlayer} executes ${
      CommandType.name
    } with ${JSON.stringify(args)}`
  );
  const cmd = new CommandType(args);
  return cmd.execute(state);
};

export const moves: { [key: string]: GameActionHandler } = {
  collectMultipleResources: (G, ctx, resources) =>
    executeCommand(G, ctx, CollectMultipleResourcesCommand, {
      resources
    }),

  collectSingleResource: (G, ctx, resource) =>
    executeCommand(G, ctx, CollectSingleResourceCommand, { resource }),

  purchaseDevelopmentCard: (G, ctx, card) =>
    executeCommand(G, ctx, PurchaseDevelopmentCardCommand, { card }),

  reserveDevelopmentCard: (G, ctx, card) =>
    executeCommand(G, ctx, ReserveDevelopmentCardCommand, { card })
};
