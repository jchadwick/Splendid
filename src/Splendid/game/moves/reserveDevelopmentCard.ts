import { DevelopmentCard, GameState } from "../../../Model";
import {
  PlayerAction,
  PlayerActionCommand,
  AvailableMove
} from "./PlayerAction";
import { findCurrentPlayer, takeDevelopmentCard } from "../../../util";

export interface ReserveDevelopmentCard extends PlayerAction {
  card: DevelopmentCard;
}

export class ReserveDevelopmentCardCommand extends PlayerActionCommand<
  ReserveDevelopmentCard
> {
  execute(state: GameState): GameState {
    const card = this.action.card;

    if (card == null) {
      throw new Error("Can't reserve an empty card!");
    }

    const player = findCurrentPlayer(state);

    // give the player a wild token
    if (state.availableTokens.Wild > 0) {
      player.tokens.Wild = (player.tokens.Wild || 0) + 1;
      state.availableTokens.Wild = (state.availableTokens.Wild || 0) - 1;
    }

    // take the card off the table and add a new one in its place
    takeDevelopmentCard(state, card);

    return state;
  }

  static readonly getAvailableMoves = (state: GameState): AvailableMove[] => {
    const player = findCurrentPlayer(state);

    if (player.reservedCards.length >= 4) {
      return [];
    }

    return state.availableCards
      .flatMap(x => x.visibleCards)
      .filter(x => x != null)
      .map(card => ({ move: "reserveDevelopmentCard", args: [card] }));
  };
}
