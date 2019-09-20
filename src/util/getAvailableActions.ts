import { PlayerActionCommand } from "ActiveGame/actions/PlayerAction";
import { Commands } from "ActiveGame/actions";
import { GameState } from "Model";
import { getWinners } from "./getWinners";

export const getAvailableActions = (state: GameState): PlayerActionCommand[] =>
  getWinners(state) != null
    ? []
    : Commands.flatMap(x => x.getAvailableActions(state)).filter(
        x => x != null
      );
