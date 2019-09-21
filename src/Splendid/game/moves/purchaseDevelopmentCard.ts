import { DevelopmentCard, GameState, ResourceTotals } from "../../../Model";
import {
  PlayerAction,
  PlayerActionCommand,
  AvailableMove
} from "./PlayerAction";
import {
  hasRequiredResources,
  calculatePayment,
  deduct,
  add,
  calculatePlayerResourceTotals,
  findCurrentPlayer,
  takeDevelopmentCard,
  calculateCardResources
} from "../../../util";

export interface PurchaseDevelopmentCard extends PlayerAction {
  card: DevelopmentCard;
}

export class PurchaseDevelopmentCardCommand extends PlayerActionCommand<
  PurchaseDevelopmentCard
> {
  static readonly INSUFFICIENT_FUNDS =
    "Player has insufficient funds to purchase this card";

  static readonly UNAVAILABLE_CARD = "Card is not available to play";

  execute(state: GameState) {
    const card = this.action.card;

    if (card == null) {
      throw new Error("Can't purchase an empty card!");
    }

    const player = findCurrentPlayer(state);

    const payment = calculatePayment(
      card.cost,
      calculatePlayerResourceTotals(player)
    );

    if (!hasRequiredResources(payment)) {
      throw new Error(PurchaseDevelopmentCardCommand.INSUFFICIENT_FUNDS);
    }

    const isOnTable = state.availableCards.some(row =>
      row.visibleCards.some(x => x && x.id === card.id)
    );

    const reservedCard = player.reservedCards.find(x => x.id === card.id);

    if (!reservedCard && !isOnTable) {
      throw new Error(PurchaseDevelopmentCardCommand.UNAVAILABLE_CARD);
    }

    // pay for it first - take it from the player...
    player.tokens = deduct(payment.tokens, player.tokens);

    // ... and add it (back) to the bank
    state.availableTokens = add(state.availableTokens, payment.tokens);

    // take it from the table
    if (isOnTable) {
      takeDevelopmentCard(state, card);
    }
    // or take it from the player's hand
    else if (reservedCard) {
      player.reservedCards.splice(
        player.reservedCards.indexOf(reservedCard),
        1
      );
    }
    // this should never happen since we've already checked for it,
    // but just to be extra careful...
    else {
      throw Error("Impossible situation");
    }

    // add the card to the collection of played cards
    player.playedCards.push(card);

    player.prestigePoints = (player.prestigePoints || 0) + card.prestigePoints;

    return state;
  }

  static readonly getAvailableMoves = (state: GameState): AvailableMove[] => {
    const visibleCards = state.availableCards.flatMap(x => x.visibleCards);
    const reservedCards = findCurrentPlayer(state).reservedCards;
    const accessibleCards = [...visibleCards, ...reservedCards].filter(
      x => x != null
    );

    const currentPlayer = findCurrentPlayer(state);

    const playerResources: ResourceTotals = {
      tokens: currentPlayer.tokens,
      cards: calculateCardResources(currentPlayer.playedCards)
    };

    const playableCards = accessibleCards.filter(card =>
      hasRequiredResources(card.cost, playerResources)
    );

    return playableCards.map(card => ({
      move: "purchaseDevelopmentCard",
      args: [card]
    }));
  };
}
