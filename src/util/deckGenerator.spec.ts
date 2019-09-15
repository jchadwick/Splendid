import { generateDeck } from "./deckGenerator";
import { ResourceType } from "../Model";

describe("Deck Generator", () => {
  it("should generate a deck from card definitions", async () => {
    const deck = await generateDeck([
      {
        level: "1",
        cost: "Diamond",
        resourceType: "Ruby",
        prestigePoints: "0"
      },
      {
        level: "2",
        cost: "Diamond & EmeraldCard",
        resourceType: "Ruby",
        prestigePoints: "1"
      }
    ]);

    expect(deck).toHaveLength(2);

    expect(deck[0].level).toBe(1);
    expect(deck[0].cost).toMatchObject({ tokens: { Diamond: 1 } });
    expect(deck[0].resourceType).toBe(ResourceType.Ruby);
    expect(deck[0].prestigePoints).toBe(0);

    expect(deck[1].level).toBe(2);
    expect(deck[1].cost).toMatchObject({
      cards: { Emerald: 1 },
      tokens: { Diamond: 1 }
    });
    expect(deck[1].resourceType).toBe(ResourceType.Ruby);
    expect(deck[1].prestigePoints).toBe(1);
  });
});
