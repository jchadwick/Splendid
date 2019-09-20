import { DevelopmentCard, Player } from "../../Model";
import { GameState } from "../../Model";
import { ReserveDevelopmentCardCommand } from "./reserveDevelopmentCard";
import { generateGameState } from "../../mockData";
import { findCurrentPlayer } from "../../util";

describe("Actions > reserveDevelopmentCard", () => {
  let player: Player;
  let cardToReserve: DevelopmentCard;
  let state: GameState;

  beforeEach(async () => {
    state = await generateGameState();
    player = findCurrentPlayer(state);
    cardToReserve = state.availableCards[0].visibleCards[0];
  });

  it("should move selected card to the players hand", () => {
    expect(player.reservedCards).not.toContain(cardToReserve);

    new ReserveDevelopmentCardCommand({ card: cardToReserve }).execute(state);

    // make sure it was added (and only added once)
    expect(
      player.reservedCards.filter(x => x.id === cardToReserve.id)
    ).toHaveLength(1);
  });

  it("should give the player 1 wild token", () => {
    expect(player.tokens.Wild).toBe(0);
    state.availableTokens.Wild = 1;

    new ReserveDevelopmentCardCommand({ card: cardToReserve }).execute(state);

    expect(player.tokens.Wild).toBe(1);
    expect(state.availableTokens.Wild).toBe(0);
  });

  it("should take the selected card from the table", () => {
    expect(
      state.availableCards.find(x => x.level === cardToReserve.level)
        .visibleCards
    ).toContain(cardToReserve);

    new ReserveDevelopmentCardCommand({ card: cardToReserve }).execute(state);

    expect(
      state.availableCards.find(x => x.level === cardToReserve.level)
        .visibleCards
    ).not.toContain(cardToReserve);
  });

  it("should repopulate card's previous position with another card", () => {
    const { visibleCards } = state.availableCards.find(
      x => x.level === cardToReserve.level
    );

    const cardPosition = visibleCards.indexOf(cardToReserve);
    expect(cardPosition).toBeGreaterThan(-1);

    new ReserveDevelopmentCardCommand({ card: cardToReserve }).execute(state);

    expect(visibleCards[cardPosition]).not.toBe(cardToReserve);
    expect(visibleCards[cardPosition]).toBeDefined();
  });
});
