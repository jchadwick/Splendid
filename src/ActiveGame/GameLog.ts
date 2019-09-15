import { PlayerActionCommand } from "./actions/PlayerAction";
import { GameState } from "../Model";
import {
  CollectMultipleResourcesCommand,
  CollectSingleResourceCommand,
  ReserveDevelopmentCardCommand,
  PurchaseDevelopmentCardCommand
} from "./actions";
import pluralize from "pluralize";
import { EndedState } from "../EndGame/EndedState";
import { recalculatePlayerTotals } from "utils";

export class GameLog {
  actionTaken(command: PlayerActionCommand, gameState: GameState) {
    const playerName = gameState.currentPlayer.name;
    if (command instanceof CollectMultipleResourcesCommand) {
      console.log(
        `[CollectMultipleResources] ${playerName} takes ${JSON.stringify(
          command.action.resources
        )}`
      );
    } else if (command instanceof CollectSingleResourceCommand) {
      console.log(
        `[CollectSingleResource] ${playerName} takes 2 ${pluralize(
          command.action.resource
        )}`
      );
    } else if (command instanceof ReserveDevelopmentCardCommand) {
      console.log(
        `[ReserveDevelopmentCard] ${playerName} reserves ${JSON.stringify(
          command.action.card
        )}`
      );
    } else if (command instanceof PurchaseDevelopmentCardCommand) {
      console.log(
        `[PurchaseDevelopmentCard] ${playerName} purchases ${JSON.stringify(
          command.action.card
        )}`
      );
    }
  }

  turnSummary(state: GameState) {
    const player = state.currentPlayer;

    recalculatePlayerTotals(player);

    console.log(
      `  Player: ${player.name} | Points: ${
        player.prestigePoints
      } | Tokens: ${JSON.stringify(player.tokens)} | Played Cards: ${
        player.playedCards.length
      } | Reserved Cards: ${player.reservedCards.length}\n`
    );
  }

  roundSummary(gameState: GameState) {
    const lead = ` ROUND START `.padStart(3).padEnd(81);
    const header = ` Player `.padEnd(20) + `Score`;
    const divider = "".padEnd(81, "-");

    let scores = gameState.players.map(
      ({ name, prestigePoints }) => `  ${name.padEnd(20)} ${prestigePoints}`
    );

    console.log(["", lead, header, divider, ...scores].join("\n"));
  }

  gameSummary(endState: EndedState) {
    const lead = ` GAME RESULTS `.padStart(3).padEnd(81);
    const header = ` Player `.padEnd(20) + `Score`;
    const divider = "".padEnd(81, "=");

    let scores = endState.rankings.map(
      ({ name, prestigePoints }) => `  ${name.padEnd(20)} ${prestigePoints}`
    );

    console.log([divider, lead, header, divider, ...scores].join("\n"));
  }
}

const gameLog = new GameLog();
export default gameLog;
