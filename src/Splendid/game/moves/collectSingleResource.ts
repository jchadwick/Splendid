import { GameState, ResourceType, NativeResourceTypes } from "../../../Model";
import {
  PlayerAction,
  PlayerActionCommand,
  AvailableMove
} from "./PlayerAction";
import { findCurrentPlayer } from "../../../util";

export interface CollectSingleResource extends PlayerAction {
  resource: ResourceType;
}

export class CollectSingleResourceCommand extends PlayerActionCommand<
  CollectSingleResource
> {
  execute(state: GameState) {
    state.availableTokens[this.action.resource] =
      (state.availableTokens[this.action.resource] || 0) - 2;

    const player = findCurrentPlayer(state);

    player.tokens[this.action.resource] =
      (player.tokens[this.action.resource] || 0) + 2;

    return state;
  }

  static readonly getAvailableMoves = (state: GameState): AvailableMove[] =>
    NativeResourceTypes.filter(type => state.availableTokens[type] >= 2)
      .map(x => ResourceType[x])
      .map(resource => ({ move: "collectSingleResource", args: [resource] }));
}
