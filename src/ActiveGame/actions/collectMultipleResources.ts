import { ResourceType, NativeResourceTypes } from "../../Model";
import { PlayerActionCommand, PlayerAction } from "./PlayerAction";
import { RunningState } from "../RunningState";

export interface CollectMultipleResources extends PlayerAction {
  resources: ResourceType[];
}

export class CollectMultipleResourcesCommand extends PlayerActionCommand<
  CollectMultipleResources
> {
  execute(gameState: RunningState) {
    for (let resource of this.action.resources) {
      gameState.availableTokens[resource] -= 1;
      gameState.currentPlayer.tokens[resource] += 1;
    }

    return gameState;
  }

  static readonly getAvailableActions = (gameState: RunningState) => {
    const availableResources = NativeResourceTypes.filter(
      type => gameState.availableTokens[type] > 0
    ).map(x => ResourceType[x] as ResourceType);

    // not enough resources to take three
    if (availableResources.length < 3) return [];

    // return all combinations of the available resources
    let actions: [ResourceType, ResourceType, ResourceType][] = [];

    for (let x of availableResources) {
      for (let y of availableResources.filter(n => n != x)) {
        for (let z of availableResources.filter(n => n != x && n != y)) {
          actions.push([x, y, z]);
        }
      }
    }

    return actions.map(
      resources => new CollectMultipleResourcesCommand({ resources })
    );
  };
}
