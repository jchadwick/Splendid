export interface GameContext {
  allowedMoves: [];
  currentPlayer: string;
  turn: number;
}

export enum ResourceType {
  Wild = "Wild",
  Emerald = "Emerald",
  Sapphire = "Sapphire",
  Ruby = "Ruby",
  Diamond = "Diamond",
  Onyx = "Onyx"
}

export type ResourceTypes = keyof typeof ResourceType;

export const AllResourceTypes: ResourceType[] = Object.freeze(
  Object.keys(ResourceType)
    .filter(x => typeof x === "string")
    .map(x => ResourceType[x] as ResourceType)
) as ResourceType[];

export const NativeResourceTypes = Object.freeze(
  Object.keys(ResourceType).filter(x => x !== ResourceType.Wild)
);

export type ResourceCount = { [key in ResourceTypes]?: number | undefined };

export interface Resource {
  readonly kind: ResourceType;
}

export interface ResourceTotals {
  tokens?: ResourceCount;
  cards?: ResourceCount;
}

export interface DevelopmentCard {
  readonly id: string;
  readonly level: number;
  readonly cost: ResourceTotals;
  readonly resourceType: ResourceType;
  readonly prestigePoints: number;
}

export interface Patron {
  readonly name: string;
  readonly cost: ResourceTotals;
  readonly prestigePoints: number;
}

export interface Player {
  id: string;
  name: string;
  isHuman: boolean;
  patrons: Patron[];
  playedCards: DevelopmentCard[];
  reservedCards: DevelopmentCard[];
  tokens: ResourceCount;
  prestigePoints: number;
}

export interface DevelopmentCardRow {
  level: number;
  stock: DevelopmentCard[];
  visibleCards: DevelopmentCard[];
}

export interface GameState {
  availableCards: DevelopmentCardRow[];
  availableTokens: ResourceCount;
  players: Player[];
  currentPlayerId: string;
}

export interface GameResults {
  winner: Player;
  rankings: Player[];
}
