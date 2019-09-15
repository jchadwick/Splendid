import { DevelopmentCardRow } from "../Model";

export const populateVisibleCards = (cardRows: DevelopmentCardRow[]) => {
  cardRows.forEach(row => {
    for (let x = 0; x < row.visibleCards.length; x++) {
      if (row.visibleCards[x] == null && row.stock.length !== 0) {
        row.visibleCards[x] = row.stock.pop();
      }
    }
  });
};
