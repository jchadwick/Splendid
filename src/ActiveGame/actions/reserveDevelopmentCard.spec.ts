import { DevelopmentCard, Player } from "../../Model";
import { RunningState } from "../RunningState";
import { ReserveDevelopmentCardCommand } from "./reserveDevelopmentCard";
import { generateRunningGameState } from "../../mockData";

describe("Actions > reserveDevelopmentCard", () => {
  let player: Player;
  let cardToReserve: DevelopmentCard;
  let gameState: RunningState;

  beforeEach(async () => {
    gameState = await generateRunningGameState();
    player = gameState.currentPlayer;
    cardToReserve = gameState.availableCards[0].visibleCards[0];
  });

  it("should move selected card to the players hand", () => {
    expect(player.reservedCards).not.toContain(cardToReserve);

    new ReserveDevelopmentCardCommand({ card: cardToReserve }).execute(
      gameState
    );

    expect(player.reservedCards).toContain(cardToReserve);
  });

  it("should give the player 1 wild token", () => {
    expect(player.tokens.Wild).toBe(0);
    gameState.availableTokens.Wild = 1;

    new ReserveDevelopmentCardCommand({ card: cardToReserve }).execute(
      gameState
    );

    expect(player.tokens.Wild).toBe(1);
    expect(gameState.availableTokens.Wild).toBe(0);
  });

  it("should take the selected card from the table", () => {
    expect(
      gameState.availableCards.find(x => x.level === cardToReserve.level)
        .visibleCards
    ).toContain(cardToReserve);

    new ReserveDevelopmentCardCommand({ card: cardToReserve }).execute(
      gameState
    );

    expect(
      gameState.availableCards.find(x => x.level === cardToReserve.level)
        .visibleCards
    ).not.toContain(cardToReserve);
  });

  it("should repopulate card's previous position with another card", () => {
    const { visibleCards } = gameState.availableCards.find(
      x => x.level === cardToReserve.level
    );

    const cardPosition = visibleCards.indexOf(cardToReserve);
    expect(cardPosition).toBeGreaterThan(-1);

    new ReserveDevelopmentCardCommand({ card: cardToReserve }).execute(
      gameState
    );

    expect(visibleCards[cardPosition]).not.toBe(cardToReserve);
    expect(visibleCards[cardPosition]).toBeDefined();
  });
});
