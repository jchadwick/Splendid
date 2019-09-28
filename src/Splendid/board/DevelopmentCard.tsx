import React from "react";
import * as Model from "../../Model";

export const DevelopmentCard = ({
  card,
  onSelected,
  canSelect
}: {
  card: Model.DevelopmentCard;
  canSelect?: boolean;
  onSelected(card: Model.DevelopmentCard): void;
}) => (
  <div
    className={`card ${card.id || canSelect ? "valid-action" : ""} ${
      card.resourceType
    }`}
    itemProp="card"
    onClick={() => (card.id || canSelect ? onSelected(card) : false)}
  >
    <div itemProp="resource" data-value={card.resourceType} />
    {card && card.prestigePoints > 0 && (
      <div itemProp="prestigePoints" data-value={card.prestigePoints} />
    )}
    <div itemProp="cost">
      {card &&
        card.cost &&
        Model.AllResourceTypes.filter(
          resource => card.cost.tokens[resource] > 0
        ).map(resource => (
          <div key={resource} itemProp="token">
            <div itemProp="resource" data-value={resource} />
            <div itemProp="count" data-value={card.cost.tokens[resource]} />
          </div>
        ))}
    </div>
  </div>
);
