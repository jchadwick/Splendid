import { DevelopmentCard, GameState } from "../Model";
import { findCurrentPlayer } from "./utils";

export const takeDevelopmentCard = (
  state: GameState,
  card: DevelopmentCard
) => {
  const player = findCurrentPlayer(state);

  for (let row of state.availableCards) {
    const matchesCardId = (x: DevelopmentCard) => x && x.id === card.id;

    const topStockCard = row.stock[row.stock.length - 1];
    const isStockCard = matchesCardId(topStockCard);

    const visibleCardIndex = row.visibleCards.findIndex(matchesCardId);
    const isVisibleCard = visibleCardIndex > -1;

    if (isStockCard) {
      row.stock.pop();
      player.reservedCards.push(card);
      return;
    } else if (isVisibleCard) {
      row.visibleCards[visibleCardIndex] = null;
      player.reservedCards.push(card);
      return;
    }
  }

  throw new Error(
    `Couldn't find card ${JSON.stringify(
      card
    )} in top card of stock piles or visible cards`
  );
};
