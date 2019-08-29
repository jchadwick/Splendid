export interface IAmWorthPrestigePoints {
  prestigePoints: number;
}

export interface ICostSomething {
  cost: ResourceTotals;
}

export enum GemColor {
  Wild = "Wild",
  Emerald = "Emerald",
  Sapphire = "Sapphire",
  Ruby = "Ruby",
  Diamond = "Diamond",
  Onyx = "Onyx"
}

type GemColors = keyof typeof GemColor;

export type GemCount = { [key in GemColors]?: number | undefined };

export interface Gem {
  readonly color: GemColor;
}

export interface ResourceTotals {
  gems?: GemCount;
  cards?: GemCount;
}

export enum DevelopmentCardLevel {
  One,
  Two,
  Three
}

export interface DevelopmentCard
  extends IAmWorthPrestigePoints,
    ICostSomething {
  readonly level: DevelopmentCardLevel;
  readonly cost: ResourceTotals;
  readonly color: GemColor;
  readonly prestigePoints: number;
}

export interface Patron extends IAmWorthPrestigePoints, ICostSomething {
  readonly name: string;
  readonly cost: ResourceTotals;
  readonly prestigePoints: number;
}

export class Player implements IAmWorthPrestigePoints {
  patrons: Patron[] = [];
  cardsInHand: DevelopmentCard[] = [];
  gemsInHand: Gem[] = [];
  playedCards: DevelopmentCard[] = [];
  prestigePoints: number = 0;

  constructor(public readonly name: string, public readonly isHuman = false) {}
}

export const deduct = (
  { gems: gemCost = {} }: ResourceTotals,
  from: ResourceTotals
): ResourceTotals =>
  Object.keys(gemCost).reduce(
    (deducted, gemType) => {
      // make sure deducted.gems actually exists
      deducted.gems = deducted.gems || {};

      if (deducted.gems[gemType] != null) {
        deducted.gems[gemType] = deducted.gems[gemType] - gemCost[gemType];
      } else {
        deducted.gems[gemType] = -gemCost[gemType];
      }

      return deducted;
    },
    // clone the input
    Object.assign({}, from || {}) as ResourceTotals
  );

export const getGemCount = (gems: (Gem | GemColor | GemColors)[]): GemCount =>
  Object.keys(GemColor).reduce((counts, color) => {
    const total = gems
      .map(x => (typeof x === "string" ? color : x.color))
      .filter(x => x === color).length;

    counts[color] = (counts[color] == null ? 0 : counts[color]) + total;

    return counts;
  }, {}) as GemCount;

export const NaturalGemColors = Object.freeze(
  Object.keys(GemColor).filter(x => x != GemColor.Wild)
);

const createGemBag = (): GemCount =>
  Object.keys(GemColor).reduce(
    (bag, color) => ((bag[color] = 0), bag),
    {} as GemCount
  );

/**
 * Determines what a player will have to pay in order to purchase an item
 *
 * @param required the item's cost
 * @param available the resources currently available
 *
 * @returns the set of resources that will satisfy the required cost
 * Any resource requirements that can't be met will be identified with a negative cost
 */
export const calculatePayment = (
  required: ResourceTotals,
  available: ResourceTotals
): ResourceTotals => {
  const availableCards = (available && available.cards) || {};
  const availableGems = (available && available.gems) || {};
  const requiredCards = (required && required.cards) || {};
  const requiredGems = (required && required.gems) || {};

  // store this outside so we can keep track as we use them
  let availableWilds = availableGems[GemColor.Wild] || 0;

  let cost = {
    cards: createGemBag(),
    gems: createGemBag()
  };

  for (let color of NaturalGemColors) {
    const availableCardsOfColor = availableCards[color] || 0;
    const availableGemsOfColor = availableGems[color] || 0;
    const requiredCardsOfColor = requiredCards[color] || 0;
    const requiredGemsOfColor = requiredGems[color] || 0;

    // Don't waste time figuring out how to pay for things that aren't required
    if (requiredCardsOfColor + requiredGemsOfColor === 0) {
      continue;
    }

    /* Example:
      Required: 3 Emeralds
      Available Cards: 1 Emerald
      Available Gems: 1 Emerald, 1 Wild
      == Cost:  1 Emerald, 1 Wild
    */

    // e.g. 3 Emeralds
    let remainingRequiredGems = requiredGemsOfColor;

    // factor in the cards we have (i.e. gems we get for "free");
    // e.g. 3 Emeralds - 1 Emerald card = 2 Emeralds still required
    const cardDiscount = Math.min(remainingRequiredGems, availableCardsOfColor);
    remainingRequiredGems -= cardDiscount;

    // how many natural tokens do we have that we can use?
    // e.g. 2 Emeralds - 1 Emerald token = 1 Emerald still required
    const naturalTokenCost = Math.min(
      remainingRequiredGems,
      availableGemsOfColor
    );
    remainingRequiredGems -= naturalTokenCost;

    // e.g. 1 Emeralds - 1 Wild token = 0 Emeralds still required
    const wildCost = Math.min(remainingRequiredGems, availableWilds);
    remainingRequiredGems -= wildCost;

    // if we aren't able to satisfy the cost, even with wilds,
    // report the deficit
    if (remainingRequiredGems > 0) {
      cost.gems[color] = -remainingRequiredGems;
    } else {
      // we're all done with our maths so go ahead and update the return value
      cost.gems[color] = (cost.gems[color] || 0) + naturalTokenCost;
      cost.gems[GemColor.Wild] = (cost.gems[GemColor.Wild] || 0) + wildCost;

      // subtract the wilds we had to use from the ones available
      // so they can't be used again
      availableWilds -= wildCost;
    }

    // card costs can only be paid with cards (only report missing cards)
    const cardDeficit = Math.max(
      0,
      requiredCardsOfColor - availableCardsOfColor
    );
    cost.cards[color] = (cost.cards[color] || 0) - cardDeficit;
  }

  return cost;
};

export const hasRequiredResources = (
  required: ResourceTotals,
  available?: ResourceTotals
): boolean => {
  const cost = available ? calculatePayment(required, available) : required;
  const missingCards = requiresAdditionalResources(cost.cards);
  const missingGems = requiresAdditionalResources(cost.gems);
  return !(missingCards || missingGems);
};

const requiresAdditionalResources = (target: GemCount | undefined) =>
  target == null ? false : Object.keys(target).some(key => target[key] < 0);
