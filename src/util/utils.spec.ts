import { ResourceTotals } from "../Model";
import { calculatePayment, hasRequiredResources, deduct } from "./utils";
import cases from "jest-in-case";

const Free: ResourceTotals = { tokens: {}, cards: {} };

describe("Utilities", () => {
  describe("calculatePayment", () => {
    interface CalculatePaymentTestCase {
      requiredResources: ResourceTotals;
      availableResources: ResourceTotals;
      expectedPayment: ResourceTotals;
    }

    it("should allow purchase of cards with only tokens", () => {
      expect(
        calculatePayment(
          { tokens: { Diamond: 1 } },
          { tokens: { Diamond: 1 } }
        ),
        "single resource cost"
      ).toMatchObject({ tokens: { Diamond: 1 } });

      expect(
        calculatePayment(
          { tokens: { Diamond: 1, Ruby: 2 } },
          { tokens: { Diamond: 5, Ruby: 5 } }
        ),
        "multiple resource cost"
      ).toMatchObject({ tokens: { Diamond: 1, Ruby: 2 } });
    });

    it("should allow purchase of cards with only tokens, including wilds", () => {
      expect(
        calculatePayment(
          { tokens: { Diamond: 3 } },
          { tokens: { Diamond: 1, Wild: 2 } }
        ),
        "single resource cost"
      ).toMatchObject({ tokens: { Diamond: 1, Wild: 2 } });

      expect(
        calculatePayment(
          { tokens: { Diamond: 1, Ruby: 2 } },
          { tokens: { Diamond: 1, Ruby: 1, Wild: 2 } }
        ),
        "multiple resource cost"
      ).toMatchObject({ tokens: { Diamond: 1, Ruby: 1, Wild: 1 } });
    });

    it("should allow purchase of cards with mixture of tokens and cards", () => {
      expect(
        calculatePayment(
          { tokens: { Diamond: 3 } },
          { cards: { Diamond: 1 }, tokens: { Diamond: 1, Wild: 2 } }
        ),
        "single resource cost"
      ).toMatchObject({ tokens: { Diamond: 1, Wild: 1 } });

      expect(
        calculatePayment(
          { tokens: { Diamond: 2, Ruby: 2 } },
          { cards: { Diamond: 1 }, tokens: { Diamond: 1, Ruby: 1, Wild: 2 } }
        ),
        "multiple resource cost"
      ).toMatchObject({ tokens: { Diamond: 1, Ruby: 1, Wild: 1 } });
    });

    cases(
      "should calculate the payment costs in a variety of scenarios",
      ({ requiredResources, availableResources, expectedPayment }) => {
        expect(
          calculatePayment(requiredResources, availableResources)
        ).toMatchObject(expectedPayment);
      },
      [
        //***  Tokens only to buy cards  ***/
        ...[
          // have exactly the natural resources that we need
          {
            requiredResources: { tokens: { Diamond: 2, Ruby: 4 } },
            availableResources: { tokens: { Diamond: 2, Ruby: 4 } },
            expectedPayment: { tokens: { Diamond: 2, Ruby: 4 } }
          },
          // have more natural resources than we need
          {
            requiredResources: { tokens: { Diamond: 2, Ruby: 4 } },
            availableResources: { tokens: { Diamond: 3, Ruby: 5 } },
            expectedPayment: { tokens: { Diamond: 2, Ruby: 4 } }
          },
          // completely broke!
          {
            requiredResources: { tokens: { Diamond: 2, Ruby: 4 } },
            availableResources: { tokens: {} },
            expectedPayment: { tokens: { Diamond: -2, Ruby: -4 } }
          },
          // don't have the natural resources, but we have enough Wilds
          {
            requiredResources: { tokens: { Diamond: 2 } },
            availableResources: { tokens: { Wild: 2 } },
            expectedPayment: { tokens: { Wild: 2 } }
          },
          // don't have the (multiple) natural resources, but we have enough Wilds
          {
            requiredResources: { tokens: { Diamond: 2, Emerald: 2 } },
            availableResources: { tokens: { Wild: 4 } },
            expectedPayment: { tokens: { Wild: 4 } }
          },
          // have some combinations of natural resources + wilds
          {
            requiredResources: { tokens: { Diamond: 2, Emerald: 2 } },
            availableResources: { tokens: { Diamond: 1, Wild: 4 } },
            expectedPayment: { tokens: { Diamond: 1, Wild: 3 } }
          },
          {
            requiredResources: { tokens: { Diamond: 2, Emerald: 2 } },
            availableResources: { tokens: { Diamond: 1, Emerald: 1, Wild: 4 } },
            expectedPayment: { tokens: { Diamond: 1, Emerald: 1, Wild: 2 } }
          },
          {
            requiredResources: { tokens: { Diamond: 2, Emerald: 2 } },
            availableResources: { tokens: { Diamond: 2, Emerald: 1, Wild: 4 } },
            expectedPayment: { tokens: { Diamond: 2, Emerald: 1, Wild: 1 } }
          }
        ],
        //***  Cards only to buy cards  ***/
        ...[
          // have exactly the natural resources that we need
          {
            requiredResources: { tokens: { Diamond: 2, Ruby: 4 } },
            availableResources: { cards: { Diamond: 2, Ruby: 4 } },
            expectedPayment: Free
          },
          // have more natural resources than we need
          {
            requiredResources: { tokens: { Diamond: 2, Ruby: 4 } },
            availableResources: { cards: { Diamond: 3, Ruby: 5 } },
            expectedPayment: Free
          },
          // have some cards, but not enough to cover the full cost
          {
            requiredResources: { tokens: { Diamond: 2, Ruby: 4 } },
            availableResources: { cards: { Diamond: 1, Ruby: 1 } },
            expectedPayment: { tokens: { Diamond: -1, Ruby: -3 } }
          },
          // completely broke!
          {
            requiredResources: { tokens: { Diamond: 2, Ruby: 4 } },
            availableResources: {},
            expectedPayment: { tokens: { Diamond: -2, Ruby: -4 } }
          }
        ],
        //***  Cards & Tokens to buy cards  ***/
        ...[
          // have some cards, but not enough to cover the full cost
          {
            requiredResources: { tokens: { Diamond: 2, Ruby: 4 } },
            availableResources: {
              tokens: { Diamond: 2, Ruby: 4 },
              cards: { Diamond: 1, Ruby: 1 }
            },
            expectedPayment: { tokens: { Diamond: 1, Ruby: 3 } }
          },
          // have enough cards to cover the cost, but also have tokens, too
          {
            requiredResources: { tokens: { Diamond: 2, Ruby: 4 } },
            availableResources: {
              tokens: { Diamond: 2, Ruby: 4 },
              cards: { Diamond: 3, Ruby: 5 }
            },
            expectedPayment: Free
          },
          // have some cards, and natural tokens, but also need wilds
          {
            requiredResources: { tokens: { Diamond: 2, Ruby: 4 } },
            availableResources: {
              tokens: { Diamond: 1, Ruby: 2, Wild: 3 },
              cards: { Diamond: 1, Ruby: 1 }
            },
            expectedPayment: { tokens: { Diamond: 1, Ruby: 2, Wild: 1 } }
          }
        ],
        //***  Cards to qualify for Patrons  ***/
        ...[
          // have just the right cards
          {
            requiredResources: { cards: { Diamond: 2, Ruby: 2 } },
            availableResources: { cards: { Diamond: 2, Ruby: 2 } },
            expectedPayment: Free
          },
          // have more than enough cards
          {
            requiredResources: { cards: { Diamond: 2, Ruby: 2 } },
            availableResources: { cards: { Diamond: 5, Ruby: 2 } },
            expectedPayment: Free
          },
          // have a lot of cards, but not the right ones
          {
            requiredResources: { cards: { Diamond: 2, Ruby: 2 } },
            availableResources: { cards: { Diamond: 1, Ruby: 1, Onyx: 1 } },
            expectedPayment: { cards: { Diamond: -1, Ruby: -1 } }
          }
        ]
      ] as CalculatePaymentTestCase[]
    );
  });

  describe("hasRequiredGemTotals", () => {
    it("should return true if player has enough resources", () => {
      expect(
        hasRequiredResources(
          { tokens: { Diamond: 1 } },
          { tokens: { Diamond: 1 } }
        )
      ).toBe(true);

      expect(
        hasRequiredResources(
          { tokens: { Diamond: 2 } },
          { tokens: { Diamond: 1, Wild: 1 } }
        ),
        "tokens with wilds"
      ).toBe(true);
    });

    it("should return false if player doesn't have enough tokens", () => {
      expect(hasRequiredResources({ tokens: { Diamond: 1 } }, {})).toBe(false);
    });
  });

  describe("deduct", () => {
    it("should deduct the cost of resources from a given value", () => {
      expect(deduct({ Diamond: 1 }, { Diamond: 3 })).toMatchObject({
        Diamond: 2
      });

      expect(
        deduct({ Diamond: 1, Wild: 1 }, { Diamond: 3, Wild: 2 })
      ).toMatchObject({ Diamond: 2, Wild: 1 });
    });

    it("should deduct the cost of resources from a given value, even if it doesn't have enough to deduct from", () => {
      expect(deduct({ Diamond: 3 }, { Diamond: 1 })).toMatchObject({
        Diamond: -2
      });

      expect(
        hasRequiredResources({
          tokens: deduct({ Diamond: 3 }, { Diamond: 1 })
        })
      ).toBe(false);
    });
  });

  describe("mergeResources", () => {
    it("should add resources to an existing set of resources", () => {
      //mergeResources;
    });
  });
});
