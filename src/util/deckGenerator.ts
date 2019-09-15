import csvReader from "csvtojson";
import {
  DevelopmentCard,
  ResourceType,
  ResourceTotals,
  NativeResourceTypes
} from "../Model";

export const AssetsCsvFilePath = require("path").resolve("./assets/Cards.csv");

type DevelopmentCardDefinition = {
  [key in keyof Omit<DevelopmentCard, "id">]: string;
};

export const importDeckFromAssets = async () =>
  importDeckFromFile(AssetsCsvFilePath);

export const importDeckFromFile = async (path: string) => {
  /*
    CSV file contains the definitions for ONE color,
    so use this as a blueprint to loop through all the colors
  */
  const blueprints: DevelopmentCardDefinition[] = await csvReader().fromFile(
    path
  );

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
        new RegExp(`\{${placeholder}\}`, "g"),
        replacements[placeholder]
      ),
    source
  );

export const generateDeck = async (definitions: DevelopmentCardDefinition[]) =>
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
