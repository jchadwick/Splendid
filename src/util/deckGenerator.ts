import {
  DevelopmentCard,
  ResourceType,
  ResourceTotals,
  NativeResourceTypes
} from "../Model";

/*
    CSV file contains the definitions for ONE color,
    so use this as a blueprint to loop through all the colors
  */
const blueprints = `
1,E,{A} & {B} & {B},0
1,E,{A} & {A} & {C} & {C},0
1,E,{C} & {C} & {C},0
1,E,{A} & {B} & {C} & {D},0
1,E,{A} & {C} & {C} & {D} & {D},0
1,E,{A} & {B} & {C} & {D} & {D},0
1,E,{D} & {D} & {D} & {D},1

2,E,{D} & {D} & {D} & {A} & {A} & {B} & {B}, 1
2,E,{E} & {E} & {C} & {C} & {C} & {B} & {B} & {B}, 1
2,E,{B} & {B} & {B} & {B} & {D} & {A} & {A}, 2
2,E,{B} & {B} & {B} & {B} & {B}, 2
2,E,{B} & {B} & {B} & {B} & {B} & {A} & {A} & {A}, 2
2,E,{E} & {E} & {E} & {E} & {E} & {E}, 3

3,E,{C} & {C} & {C} & {D} & {D} & {D} & {A} & {A} & {A} & {B} & {B} & {B} & {B} & {B},3
3,E,{A} & {A} & {A} & {A} & {A} & {A} & {A},4
3,E,{A} & {A} & {A} & {A} & {A} & {A} & {E} & {E} & {E} & {B} & {B} & {B},4
3,E,{A} & {A} & {A} & {A} & {A} & {A} & {A} & {E} & {E} & {E},5`
  .split(/\n/)
  .filter(line => line && line.length)
  .map(line => line.split(","))
  .map(
    ([level, resourceType, cost, prestigePoints]) =>
      ({
        level,
        resourceType,
        cost,
        prestigePoints
      } as DevelopmentCardDefinition)
  );

type DevelopmentCardDefinition = {
  [key in keyof Omit<DevelopmentCard, "id">]: string;
};

export const importDeck = () => {
  const definitions = [
    // matrix containing all variations of the placeholders coming first
    ["A", "B", "C", "D", "E"],
    ["B", "C", "D", "E", "A"],
    ["C", "D", "E", "A", "B"],
    ["D", "E", "A", "B", "C"],
    ["E", "A", "B", "C", "D"]
  ].flatMap(placeholders =>
    convertBlueprintsToDefinitions(blueprints, placeholders)
  );

  return generateDeck(definitions);
};

/** Generates the set of cards from the blueprint for a single resource */
const convertBlueprintsToDefinitions = (
  blueprint,
  placeholders
): DevelopmentCardDefinition[] => {
  // create the mapping from placeholders to their actual values,
  // e.g. "A" -> "Gold", "B" -> "Silver", etc.
  const resourceMap = placeholders.reduce((map, x, idx) => {
    map[x] = NativeResourceTypes[idx];
    return map;
  }, {});

  return blueprint.map(
    ({ cost, level, prestigePoints, resourceType }) =>
      ({
        cost: replacePlaceholders(cost, placeholders, resourceMap),
        level: level,
        prestigePoints: prestigePoints,
        resourceType: resourceMap[resourceType]
      } as DevelopmentCardDefinition)
  );
};

const replacePlaceholders = (source, placeholders, replacements) =>
  placeholders.reduce(
    (replaced, placeholder) =>
      replaced.replace(
        new RegExp(`{${placeholder}}`, "g"),
        replacements[placeholder]
      ),
    source
  );

export const generateDeck = (definitions: DevelopmentCardDefinition[]) =>
  definitions.filter(isValidDefinition).map(toDevelopmentCard);

const isValidDefinition = (definition: DevelopmentCardDefinition) =>
  definition &&
  !!definition.cost &&
  isANumber(definition.level, 1, 3) &&
  isResourceType(definition.resourceType) &&
  isANumber(definition.prestigePoints, 0, 10);

const isResourceType = value => Object.keys(ResourceType).indexOf(value) > -1;

const isANumber = (input: string, min: number, max: number) =>
  ((parsed: number) => !Number.isNaN(parsed) && parsed >= min && parsed <= max)(
    Number(input)
  );

const toDevelopmentCard = (
  { cost, level, prestigePoints, resourceType }: DevelopmentCardDefinition,
  id: number
): DevelopmentCard => ({
  id: `${id}_L${level}_${resourceType}`,
  level: Number(level),
  resourceType: ResourceType[resourceType],
  cost: parseCost(cost),
  prestigePoints: Number(prestigePoints)
});

const parseCost = (cost: string): ResourceTotals =>
  (cost || "")
    .split("&")
    .map(x => x.trim())
    .reduce(
      (totals, resource) => {
        const isCard = resource.endsWith("Card");

        const resourceType = isCard
          ? resource.substr(0, resource.length - "Card".length)
          : resource;

        const costGroup = totals[isCard ? "cards" : "tokens"];
        costGroup[resourceType] = (costGroup[resourceType] || 0) + 1;

        return totals;
      },
      { cards: {}, tokens: {} } as ResourceTotals
    );
