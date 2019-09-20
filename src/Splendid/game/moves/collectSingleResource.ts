import { GameState, ResourceType, NativeResourceTypes } from "../../../Model";
import { PlayerAction, PlayerActionCommand } from "./PlayerAction";
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

  static readonly getAvailableActions = (gameState: GameState) =>
    NativeResourceTypes.filter(type => gameState.availableTokens[type] >= 2)
      .map(x => ResourceType[x])
      .map(resource => new CollectSingleResourceCommand({ resource }));
}
