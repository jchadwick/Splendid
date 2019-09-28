import { Box } from "@material-ui/core";
import React from "react";
import * as Model from "../../Model";
import { Column, Row } from "./components";

export const PlayerList = ({ players, currentPlayer }) => (
  <>
    {players.map((player: Model.Player) => (
      <PlayerOverview
        key={player.id}
        isCurrentPlayer={player === currentPlayer}
        player={player}
      />
    ))}
  </>
);

const PlayerOverview = ({
  isCurrentPlayer,
  player
}: {
  isCurrentPlayer: boolean;
  player: Model.Player;
}) => (
  <Column
    className={`player ${isCurrentPlayer && "active"}`}
    itemScope
    itemType="urn:x:player"
    itemID={String(player.id)}
  >
    <Row>
      <Box flexGrow={1} itemProp="name">
        {player.name}
      </Box>
      <Box fontWeight={800}>{player.prestigePoints}</Box>
    </Row>
    <Box
      className="tokens"
      minHeight="4em"
      fontSize="40%"
      border="1px ridge #ccc"
    >
      {Object.keys(player.tokens).map(
        resource =>
          player.tokens[resource] > 0 && (
            <div key={resource} itemProp="token">
              <div itemProp="resource" data-value={resource} />
              <div itemProp="count" data-value={player.tokens[resource]} />
            </div>
          )
      )}
    </Box>
    <Row
      className="inventory"
      flexGrow={1}
      minHeight="10em"
      marginTop="1em"
      border="1px ridge #ccc"
    >
      <Row justifyContent="space-between" flexWrap="wrap" fontSize="70%">
        {player.playedCards.map(card => (
          <PlayedCard card={card} />
        ))}
      </Row>
    </Row>
  </Column>
);

interface PlayedCardProps {
  card: Model.DevelopmentCard;
}

const PlayedCard = ({ card }: PlayedCardProps) => (
  <Box
    width="3em"
    height="4em"
    borderRadius=".5em"
    position="relative"
    border="1px ridge #333"
    margin="0 1em"
    fontSize="70%"
    padding=".5em"
  >
    <div itemProp="resource" data-value={card.resourceType} />
    <div itemProp="prestigePoints" data-value={card.prestigePoints} />
  </Box>
);
