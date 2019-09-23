import { CollectMultipleResourcesCommand } from "./collectMultipleResources";
import { CollectSingleResourceCommand } from "./collectSingleResource";
import { PurchaseDevelopmentCardCommand } from "./purchaseDevelopmentCard";
import { ReserveDevelopmentCardCommand } from "./reserveDevelopmentCard";
import { PlayerActionCommand } from "./PlayerAction";
import { GameContext, GameState } from "../../../Model";
import { findCurrentPlayer } from "../../../util";

interface GameActionHandler {
  (G: GameState, ctx: GameContext, ...args): GameState;
}

export const getAvailableMoves = (state: GameState) =>
  [
    CollectMultipleResourcesCommand,
    CollectSingleResourceCommand,
    PurchaseDevelopmentCardCommand,
    ReserveDevelopmentCardCommand
  ].flatMap(cmd => cmd.getAvailableMoves(state));

const executeCommand = (
  state: GameState,
  ctx: GameContext,
  CommandType: { new (...args): PlayerActionCommand },
  args?
): GameState => {
  try {
    const cmd = new CommandType(args);
    return cmd.execute(state);
  } catch (err) {
    console.error(err);
    return state;
  }
};

export const moves: { [key: string]: GameActionHandler } = {
  triggerWin: g => {
    const player = findCurrentPlayer(g);
    player.prestigePoints = 15;
    return g;
  },
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

export default moves;
