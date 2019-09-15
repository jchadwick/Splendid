import { DevelopmentCard, GameState } from "../../Model";
import { PlayerAction, PlayerActionCommand } from "./PlayerAction";
import { takeDevelopmentCard } from "../../util";

export interface ReserveDevelopmentCard extends PlayerAction {
  card: DevelopmentCard;
}

export class ReserveDevelopmentCardCommand extends PlayerActionCommand<
  ReserveDevelopmentCard
> {
  execute(gameState: GameState): GameState {
    const card = this.action.card;

    if (card == null) {
      throw new Error("Can't reserve an empty card!");
    }

    const player = gameState.currentPlayer;

    // add the card to the player's hand
    player.reservedCards.push(card);

    // give the player a wild token
    if (gameState.availableTokens.Wild > 0) {
      player.tokens.Wild += 1;
      gameState.availableTokens.Wild -= 1;
    }

    // take the card off the table and add a new one in its place
    takeDevelopmentCard(gameState, card);

    return gameState;
  }

  static readonly getAvailableActions = (gameState: GameState) =>
    gameState.availableCards
      .flatMap(x => x.visibleCards)
      .filter(x => x != null)
      .map(card => new ReserveDevelopmentCardCommand({ card }));
}
