import { CollectMultipleResourcesCommand } from "./collectMultipleResources";
import { CollectSingleResourceCommand } from "./collectSingleResource";
import { PurchaseDevelopmentCardCommand } from "./purchaseDevelopmentCard";
import { ReserveDevelopmentCardCommand } from "./reserveDevelopmentCard";
import { PlayerActionCommandStatic } from "./PlayerAction";

export const Commands = [
  CollectMultipleResourcesCommand,
  CollectSingleResourceCommand,
  PurchaseDevelopmentCardCommand,
  ReserveDevelopmentCardCommand
] as PlayerActionCommandStatic[];

export * from "./collectMultipleResources";
export * from "./collectSingleResource";
export * from "./purchaseDevelopmentCard";
export * from "./reserveDevelopmentCard";
