import { ResourceType, NativeResourceTypes } from "../../Model";
import { PlayerAction, PlayerActionCommand } from "./PlayerAction";
import { RunningState } from "../RunningState";

export interface CollectSingleResource extends PlayerAction {
  resource: ResourceType;
}

export class CollectSingleResourceCommand extends PlayerActionCommand<
  CollectSingleResource
> {
  execute(gameState: RunningState) {
    gameState.availableTokens[this.action.resource] -= 2;
    gameState.currentPlayer.tokens[this.action.resource] += 2;
    return gameState;
  }

  static readonly getAvailableActions = (gameState: RunningState) =>
    NativeResourceTypes.filter(type => gameState.availableTokens[type] >= 2)
      .map(x => ResourceType[x])
      .map(resource => new CollectSingleResourceCommand({ resource }));
}
