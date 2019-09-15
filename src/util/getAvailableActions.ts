import { PlayerActionCommand } from "ActiveGame/actions/PlayerAction";
import { Commands } from "ActiveGame/actions";
import { GameState } from "Model";

export const getAvailableActions = (
  gameState: GameState
): PlayerActionCommand[] =>
  gameState.gameOver
    ? []
    : Commands.flatMap(x => x.getAvailableActions(gameState)).filter(
        x => x != null
      );
