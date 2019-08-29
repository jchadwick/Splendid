import {
  calculatePayment,
  ResourceTotals,
  hasRequiredResources,
  deduct
} from "./Model";
import cases from "jest-in-case";

const Free: ResourceTotals = { gems: {}, cards: {} };

describe("Model", () => {
  describe("calculatePayment", () => {
    interface CalculatePaymentTestCase {
      requiredResources: ResourceTotals;
      availableResources: ResourceTotals;
      expectedPayment: ResourceTotals;
    }

    it("should allow purchase of cards with only tokens", () => {
      expect(
        calculatePayment({ gems: { Diamond: 1 } }, { gems: { Diamond: 1 } }),
        "single resource cost"
      ).toMatchObject({ gems: { Diamond: 1 } });

      expect(
        calculatePayment(
          { gems: { Diamond: 1, Ruby: 2 } },
          { gems: { Diamond: 5, Ruby: 5 } }
        ),
        "multiple resource cost"
      ).toMatchObject({ gems: { Diamond: 1, Ruby: 2 } });
    });

    it("should allow purchase of cards with only tokens, including wilds", () => {
      expect(
        calculatePayment(
          { gems: { Diamond: 3 } },
          { gems: { Diamond: 1, Wild: 2 } }
        ),
        "single resource cost"
      ).toMatchObject({ gems: { Diamond: 1, Wild: 2 } });

      expect(
        calculatePayment(
          { gems: { Diamond: 1, Ruby: 2 } },
          { gems: { Diamond: 1, Ruby: 1, Wild: 2 } }
        ),
        "multiple resource cost"
      ).toMatchObject({ gems: { Diamond: 1, Ruby: 1, Wild: 1 } });
    });

    it("should allow purchase of cards with mixture of tokens and cards", () => {
      expect(
        calculatePayment(
          { gems: { Diamond: 3 } },
          { cards: { Diamond: 1 }, gems: { Diamond: 1, Wild: 2 } }
        ),
        "single resource cost"
      ).toMatchObject({ gems: { Diamond: 1, Wild: 1 } });

      expect(
        calculatePayment(
          { gems: { Diamond: 2, Ruby: 2 } },
          { cards: { Diamond: 1 }, gems: { Diamond: 1, Ruby: 1, Wild: 2 } }
        ),
        "multiple resource cost"
      ).toMatchObject({ gems: { Diamond: 1, Ruby: 1, Wild: 1 } });
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
            requiredResources: { gems: { Diamond: 2, Ruby: 4 } },
            availableResources: { gems: { Diamond: 2, Ruby: 4 } },
            expectedPayment: { gems: { Diamond: 2, Ruby: 4 } }
          },
          // have more natural resources than we need
          {
            requiredResources: { gems: { Diamond: 2, Ruby: 4 } },
            availableResources: { gems: { Diamond: 3, Ruby: 5 } },
            expectedPayment: { gems: { Diamond: 2, Ruby: 4 } }
          },
          // completely broke!
          {
            requiredResources: { gems: { Diamond: 2, Ruby: 4 } },
            availableResources: { gems: {} },
            expectedPayment: { gems: { Diamond: -2, Ruby: -4 } }
          },
          // don't have the natural resources, but we have enough Wilds
          {
            requiredResources: { gems: { Diamond: 2 } },
            availableResources: { gems: { Wild: 2 } },
            expectedPayment: { gems: { Wild: 2 } }
          },
          // don't have the (multiple) natural resources, but we have enough Wilds
          {
            requiredResources: { gems: { Diamond: 2, Emerald: 2 } },
            availableResources: { gems: { Wild: 4 } },
            expectedPayment: { gems: { Wild: 4 } }
          },
          // have some combinations of natural resources + wilds
          {
            requiredResources: { gems: { Diamond: 2, Emerald: 2 } },
            availableResources: { gems: { Diamond: 1, Wild: 4 } },
            expectedPayment: { gems: { Diamond: 1, Wild: 3 } }
          },
          {
            requiredResources: { gems: { Diamond: 2, Emerald: 2 } },
            availableResources: { gems: { Diamond: 1, Emerald: 1, Wild: 4 } },
            expectedPayment: { gems: { Diamond: 1, Emerald: 1, Wild: 2 } }
          },
          {
            requiredResources: { gems: { Diamond: 2, Emerald: 2 } },
            availableResources: { gems: { Diamond: 2, Emerald: 1, Wild: 4 } },
            expectedPayment: { gems: { Diamond: 2, Emerald: 1, Wild: 1 } }
          }
        ],
        //***  Cards only to buy cards  ***/
        ...[
          // have exactly the natural resources that we need
          {
            requiredResources: { gems: { Diamond: 2, Ruby: 4 } },
            availableResources: { cards: { Diamond: 2, Ruby: 4 } },
            expectedPayment: Free
          },
          // have more natural resources than we need
          {
            requiredResources: { gems: { Diamond: 2, Ruby: 4 } },
            availableResources: { cards: { Diamond: 3, Ruby: 5 } },
            expectedPayment: Free
          },
          // have some cards, but not enough to cover the full cost
          {
            requiredResources: { gems: { Diamond: 2, Ruby: 4 } },
            availableResources: { cards: { Diamond: 1, Ruby: 1 } },
            expectedPayment: { gems: { Diamond: -1, Ruby: -3 } }
          },
          // completely broke!
          {
            requiredResources: { gems: { Diamond: 2, Ruby: 4 } },
            availableResources: {},
            expectedPayment: { gems: { Diamond: -2, Ruby: -4 } }
          }
        ],
        //***  Cards & Tokens to buy cards  ***/
        ...[
          // have some cards, but not enough to cover the full cost
          {
            requiredResources: { gems: { Diamond: 2, Ruby: 4 } },
            availableResources: {
              gems: { Diamond: 2, Ruby: 4 },
              cards: { Diamond: 1, Ruby: 1 }
            },
            expectedPayment: { gems: { Diamond: 1, Ruby: 3 } }
          },
          // have enough cards to cover the cost, but also have tokens, too
          {
            requiredResources: { gems: { Diamond: 2, Ruby: 4 } },
            availableResources: {
              gems: { Diamond: 2, Ruby: 4 },
              cards: { Diamond: 3, Ruby: 5 }
            },
            expectedPayment: Free
          },
          // have some cards, and natural tokens, but also need wilds
          {
            requiredResources: { gems: { Diamond: 2, Ruby: 4 } },
            availableResources: {
              gems: { Diamond: 1, Ruby: 2, Wild: 3 },
              cards: { Diamond: 1, Ruby: 1 }
            },
            expectedPayment: { gems: { Diamond: 1, Ruby: 2, Wild: 1 } }
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
        hasRequiredResources({ gems: { Diamond: 1 } }, { gems: { Diamond: 1 } })
      ).toBe(true);

      expect(
        hasRequiredResources(
          { gems: { Diamond: 2 } },
          { gems: { Diamond: 1, Wild: 1 } }
        ),
        "tokens with wilds"
      ).toBe(true);
    });

    it("should return false if player doesn't have enough tokens", () => {
      expect(hasRequiredResources({ gems: { Diamond: 1 } }, {})).toBe(false);
    });
  });

  describe("deduct", () => {
    it("should deduct the cost of resources from a given value", () => {
      expect(
        deduct({ gems: { Diamond: 1 } }, { gems: { Diamond: 3 } })
      ).toMatchObject({ gems: { Diamond: 2 } });

      expect(
        deduct(
          { gems: { Diamond: 1, Wild: 1 } },
          { gems: { Diamond: 3, Wild: 2 } }
        )
      ).toMatchObject({ gems: { Diamond: 2, Wild: 1 } });
    });

    it("should deduct the cost of resources from a given value, even if it doesn't have enough to deduct from", () => {
      expect(
        deduct({ gems: { Diamond: 3 } }, { gems: { Diamond: 1 } })
      ).toMatchObject({ gems: { Diamond: -2 } });

      expect(
        hasRequiredResources(
          deduct({ gems: { Diamond: 3 } }, { gems: { Diamond: 1 } })
        )
      ).toBe(false);
    });
  });
});
