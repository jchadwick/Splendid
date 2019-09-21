import {
  ResourceTotals,
  Resource,
  ResourceType,
  ResourceCount,
  ResourceTypes,
  NativeResourceTypes,
  DevelopmentCard,
  Player,
  GameState
} from "../Model";

export const deduct = (
  cost: ResourceCount,
  from: ResourceCount
): ResourceCount =>
  Object.keys(cost).reduce(
    (deducted, resourceType) => {
      if (deducted[resourceType] != null) {
        deducted[resourceType] = deducted[resourceType] - cost[resourceType];
      } else {
        deducted[resourceType] = -cost[resourceType];
      }

      return deducted;
    },
    // clone the input
    Object.assign({}, from || {}) as ResourceCount
  );

export const getGemCount = (
  tokens: (Resource | ResourceType | ResourceTypes)[]
): ResourceCount =>
  Object.keys(ResourceType).reduce((counts, color) => {
    const total = tokens
      .map(x => (typeof x === "string" ? color : x.kind))
      .filter(x => x === color).length;

    counts[color] = (counts[color] == null ? 0 : counts[color]) + total;

    return counts;
  }, {}) as ResourceCount;

export const createResourceCollection = (): ResourceCount =>
  Object.keys(ResourceType).reduce(
    // eslint-disable-next-line
    (bag, color) => ((bag[color] = 0), bag),
    {} as ResourceCount
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
  const availableTokens = (available && available.tokens) || {};
  const requiredCards = (required && required.cards) || {};
  const requiredTokens = (required && required.tokens) || {};

  // store this outside so we can keep track as we use them
  let availableWilds = availableTokens[ResourceType.Wild] || 0;

  let cost = {
    cards: createResourceCollection(),
    tokens: createResourceCollection()
  };

  for (let color of NativeResourceTypes) {
    const availableCardsOfColor = availableCards[color] || 0;
    const availableTokensOfColor = availableTokens[color] || 0;
    const requiredCardsOfColor = requiredCards[color] || 0;
    const requiredTokensOfColor = requiredTokens[color] || 0;

    // Don't waste time figuring out how to pay for things that aren't required
    if (requiredCardsOfColor + requiredTokensOfColor === 0) {
      continue;
    }

    /* Example:
        Required: 3 Emeralds
        Available Cards: 1 Emerald
        Available Tokens: 1 Emerald, 1 Wild
        == Cost:  1 Emerald, 1 Wild
      */

    // e.g. 3 Emeralds
    let remainingRequiredTokens = requiredTokensOfColor;

    // factor in the cards we have (i.e. tokens we get for "free");
    // e.g. 3 Emeralds - 1 Emerald card = 2 Emeralds still required
    const cardDiscount = Math.min(
      remainingRequiredTokens,
      availableCardsOfColor
    );
    remainingRequiredTokens -= cardDiscount;

    // how many natural tokens do we have that we can use?
    // e.g. 2 Emeralds - 1 Emerald token = 1 Emerald still required
    const naturalTokenCost = Math.min(
      remainingRequiredTokens,
      availableTokensOfColor
    );
    remainingRequiredTokens -= naturalTokenCost;

    // e.g. 1 Emeralds - 1 Wild token = 0 Emeralds still required
    const wildCost = Math.min(remainingRequiredTokens, availableWilds);
    remainingRequiredTokens -= wildCost;

    // if we aren't able to satisfy the cost, even with wilds,
    // report the deficit
    if (remainingRequiredTokens > 0) {
      cost.tokens[color] = -remainingRequiredTokens;
    } else {
      // we're all done with our maths so go ahead and update the return value
      cost.tokens[color] = (cost.tokens[color] || 0) + naturalTokenCost;
      cost.tokens[ResourceType.Wild] =
        (cost.tokens[ResourceType.Wild] || 0) + wildCost;

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
  const missingResources = requiresAdditionalResources(cost.tokens);
  return !(missingCards || missingResources);
};

const requiresAdditionalResources = (target: ResourceCount | undefined) =>
  target == null ? false : Object.keys(target).some(key => target[key] < 0);

export const add = (
  target: ResourceCount,
  toMerge: ResourceCount
): ResourceCount =>
  Object.keys(toMerge).reduce(
    (sum, resourceType) => {
      if (sum[resourceType] != null) {
        sum[resourceType] = sum[resourceType] + toMerge[resourceType];
      } else {
        sum[resourceType] = toMerge[resourceType];
      }

      return sum;
    },
    // clone the input
    Object.assign({}, target || {}) as ResourceCount
  );

export const times = count => <TResult>(
  f: (i?: number) => TResult
): TResult[] => {
  let results: TResult[] = [];

  for (let i = 0; i < count; i++) {
    results.push(f(i));
  }

  return results;
};

export const randomItem = <T>(items: T[]): T =>
  items[Math.floor(Math.random() * items.length)];

export const waitFor = (predicate: () => boolean) =>
  new Promise((done, reject) => {
    let count = 0;
    let timer = setInterval(() => {
      if (predicate()) {
        done();
        clearInterval(timer);
      } else if (++count >= 10) {
        reject();
      }
    }, 100);
  });

export const getCardResourceCount = (cards: DevelopmentCard[]): ResourceCount =>
  cards.reduce(
    (cardResources, card) => {
      cardResources[card.resourceType] =
        (cardResources[card.resourceType] || 0) + 1;
      return cardResources;
    },
    {} as ResourceCount
  );

export const calculatePlayerResourceTotals = ({
  playedCards,
  tokens
}: Player) => ({
  tokens: tokens,
  cards: calculateCardResources(playedCards)
});

export const calculateCardResources = (cards: DevelopmentCard[]) =>
  cards.reduce(
    (cardResources, card) => {
      cardResources[card.resourceType] =
        (cardResources[card.resourceType] || 0) + 1;
      return cardResources;
    },
    {} as ResourceCount
  );

export const calculatePlayerPrestigePoints = ({
  patrons,
  playedCards
}: Player) =>
  [...patrons, ...playedCards].reduce(
    (total, x) => (total += x.prestigePoints),
    0
  );

export const recalculatePlayerTotals = (
  playerOrState: Player | GameState
): void => {
  if ("id" in playerOrState) {
    const player = playerOrState;
    player.prestigePoints = calculatePlayerPrestigePoints(player);
  } else {
    playerOrState.players.forEach(recalculatePlayerTotals);
  }
};

export const findCurrentPlayer = (state: GameState): Player => {
  const player = findPlayer(state.players, state.currentPlayerId);
  if (player == null) {
    throw new Error("Couldn't find current player");
  }
  return player;
};

export const findPlayer = (
  players: Player[],
  playerId: string
): Player | null =>
  players == null ? null : players.find(x => x.id === playerId);

export const clone = <T>(source: T): T => JSON.parse(JSON.stringify(source));
