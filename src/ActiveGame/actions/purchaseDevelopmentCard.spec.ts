import { PurchaseDevelopmentCardCommand } from "./purchaseDevelopmentCard";
import { DevelopmentCard, Player } from "../../Model";
import { RunningState } from "../RunningState";
import { generateRunningGameState } from "../../mockData";
import { recalculatePlayerTotals } from "../../utils";

describe("Actions > PurchaseDevelopmentCard", () => {
  let player: Player;
  let cardToPurchase: DevelopmentCard;
  let gameState: RunningState;

  beforeEach(async () => {
    gameState = await generateRunningGameState();
    player = gameState.currentPlayer;
    cardToPurchase = gameState.availableCards[0].visibleCards[0];

    expect(player).not.toBeUndefined();
    expect(cardToPurchase).not.toBeUndefined();
  });

  describe("when the card is already in the players hand", () => {
    beforeEach(() => {
      player.reservedCards.push(cardToPurchase);
    });

    it("should purchase a card from the player's hand when they can afford it", () => {
      // Make sure the player can purchase with diamonds
      cardToPurchase.cost.cards = {};
      cardToPurchase.cost.tokens = { Diamond: 1 };
      player.tokens.Diamond = 1;
      recalculatePlayerTotals(player);

      // Make sure the bank doesn't have any Diamonds
      gameState.availableTokens.Diamond = 0;

      new PurchaseDevelopmentCardCommand({ card: cardToPurchase }).execute(
        gameState
      );

      // Make sure the card has been played
      expect(player.playedCards).toContainEqual(cardToPurchase);

      // Make sure they paid for it (to the bank)
      expect(player.tokens.Diamond).toBe(0);
      expect(gameState.availableTokens.Diamond).toBe(1);
    });

    it("should throw an error when player tries to purchase a card they can't afford", () => {
      expect(() =>
        new PurchaseDevelopmentCardCommand({ card: cardToPurchase }).execute(
          gameState
        )
      ).toThrowError(PurchaseDevelopmentCardCommand.INSUFFICIENT_FUNDS);

      // Make sure the card has NOT been played
      expect(player.playedCards).not.toContain(cardToPurchase);
    });
  });
});
