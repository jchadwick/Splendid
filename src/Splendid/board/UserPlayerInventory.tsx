import { Box } from "@material-ui/core";
import { styled } from "@material-ui/styles";
import React from "react";
import * as Model from "../../Model";
import { Column, Row } from "./components";
import { DevelopmentCard } from "./DevelopmentCard";

const CurrentPlayerName = styled("h3")({
  writingMode: "vertical-lr",
  textOrientation: "upright"
});

export const UserPlayerInventory = ({
  isCurrentPlayer,
  player,
  onPlayReservedCard
}: {
  isCurrentPlayer: boolean;
  player: Model.Player;
  onPlayReservedCard(card: Model.DevelopmentCard): void;
}) => (
  <Row
    position="relative"
    flexGrow={1}
    className={isCurrentPlayer ? "active" : ""}
  >
    <CurrentPlayerName>{player.name}</CurrentPlayerName>
    <Box
      className="prestigePoints"
      width="2rem"
      fontSize="150%"
      fontWeight="800"
    >
      {player.prestigePoints}
    </Box>
    <Row flexGrow={1}>
      <Row border="1px solid #333">
        <Column
          id="playerTokens"
          fontSize="140%"
          flexWrap="wrap"
          width="4rem"
          padding=".4rem .2rem"
        >
          {Model.AllResourceTypes.filter(
            resource => player.tokens[resource] > 0
          ).map(
            resource =>
              player.tokens[resource] > 0 && (
                <div key={resource} itemProp="token">
                  <div itemProp="resource" data-value={resource} />
                  <div itemProp="count" data-value={player.tokens[resource]} />
                </div>
              )
          )}
        </Column>
        <Row id="reservedCards" flexGrow={1}>
          {player.reservedCards.map(card => (
            <DevelopmentCard
              key={card.id}
              card={card}
              onSelected={onPlayReservedCard}
            />
          ))}
        </Row>
      </Row>
      <Row id="playedCards" flexGrow={1} height="100%">
        {groupCards(player.playedCards).map(({ resourceType, cards }) => (
          <Column
            className={`cardStack ${resourceType}`}
            width="5rem"
            position="relative"
            fontSize="5em"
            fontWeight={600}
            justifyContent="center"
            alignContent="center"
          >
            {cards.length}
          </Column>
        ))}
      </Row>
    </Row>
  </Row>
);

type DevelopmentCardGroup = {
  resourceType: Model.ResourceType;
  cards: Model.DevelopmentCard[];
};

const groupCards = (cards: Model.DevelopmentCard[]): DevelopmentCardGroup[] =>
  cards.reduce((grouped: DevelopmentCardGroup[], card) => {
    const { resourceType } = card;
    let group = grouped.find(x => x.resourceType === resourceType);

    if (group == null) {
      grouped.push({ resourceType, cards: [card] });
    } else {
      group.cards.push(card);
    }

    return grouped;
  }, []);
