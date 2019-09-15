import { DevelopmentCard, GameState } from "../Model";

export const takeDevelopmentCard = (
  state: GameState,
  card: DevelopmentCard
) => {
  if (card == null) {
    throw new Error("Can't take an empty card!");
  }

  for (let row of state.availableCards) {
    const matchesCardId = (x: DevelopmentCard) => x && x.id === card.id;

    const topStockCard = row.stock[row.stock.length - 1];
    const isStockCard = matchesCardId(topStockCard);

    const visibleCardIndex = row.visibleCards.findIndex(matchesCardId);
    const isVisibleCard = visibleCardIndex > -1;

    if (isStockCard) {
      row.stock.pop();
      state.currentPlayer.reservedCards.push(card);
      return;
    } else if (isVisibleCard) {
      row.visibleCards[visibleCardIndex] = null;
      state.currentPlayer.reservedCards.push(card);
      return;
    }
  }

  throw new Error(
    `Couldn't find card ${JSON.stringify(
      card
    )} in top card of stock piles or visible cards`
  );
};
