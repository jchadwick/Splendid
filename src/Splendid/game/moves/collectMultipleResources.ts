import { GameState, ResourceType, NativeResourceTypes } from "../../../Model";
import { PlayerActionCommand, PlayerAction } from "./PlayerAction";
import { findCurrentPlayer } from "../../../util";

export interface CollectMultipleResources extends PlayerAction {
  resources: ResourceType[];
}

export class CollectMultipleResourcesCommand extends PlayerActionCommand<
  CollectMultipleResources
> {
  execute(state: GameState) {
    for (let resource of this.action.resources) {
      state.availableTokens[resource] =
        (state.availableTokens[resource] || 0) - 1;

      findCurrentPlayer(state).tokens[resource] =
        (findCurrentPlayer(state).tokens[resource] || 0) + 1;
    }

    return state;
  }

  static readonly getAvailableActions = (state: GameState) => {
    const availableResources = NativeResourceTypes.filter(
      type => state.availableTokens[type] > 0
    ).map(x => ResourceType[x] as ResourceType);

    // not enough resources to take three
    if (availableResources.length < 3) return [];

    // return all combinations of the available resources
    let actions: [ResourceType, ResourceType, ResourceType][] = [];

    for (let x of availableResources) {
      for (let y of availableResources.filter(n => n !== x)) {
        for (let z of availableResources.filter(n => n !== x && n !== y)) {
          actions.push([x, y, z]);
        }
      }
    }

    return actions.map(
      resources => new CollectMultipleResourcesCommand({ resources })
    );
  };
}
