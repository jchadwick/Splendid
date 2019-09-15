import { DevelopmentCard, GameState } from "../Model";

export const takeDevelopmentCard = (
  state: GameState,
  card: DevelopmentCard
) => {
  if (card == null) {
    throw new Error("Can't take an empty card!");
  }

  for (let row of state.availableCards) {
    const index = row.visibleCards.findIndex(x => x && x.id === card.id);

    if (index > -1) {
      row.visibleCards.splice(index, 1, row.stock.pop());
      return;
    }
  }

  throw new Error(`Couldn't find card ${JSON.stringify(card)}`);
};
