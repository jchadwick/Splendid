import React from "react";
import * as Model from "../../Model";
import { Column } from "./components";
import clsx from "clsx";

interface PlayedDevelopmentCardsProps {
  cards: Model.DevelopmentCard[];
}

export const GroupedDevelopmentCards = ({
  cards
}: PlayedDevelopmentCardsProps) => {
  const groupedCards = Model.NativeResourceTypes.map(resourceType => ({
    resourceType,
    cards: cards.filter(x => x.resourceType === resourceType)
  }));

  return (
    <>
      {groupedCards.map(({ resourceType, cards }) => (
        <Column
          key={resourceType}
          className={clsx("cardStack", resourceType, {
            empty: !cards || cards.length === 0
          })}
        >
          {cards.length}
        </Column>
      ))}
    </>
  );
};
