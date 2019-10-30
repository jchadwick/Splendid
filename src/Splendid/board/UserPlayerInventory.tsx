import { Box } from "@material-ui/core";
import { styled } from "@material-ui/styles";
import React from "react";
import * as Model from "../../Model";
import { Column, Row } from "./components";
import { DevelopmentCard } from "./DevelopmentCard";
import { GroupedDevelopmentCards } from "./GroupedDevelopmentCards";
import { Tokens } from "./Tokens";
import clsx from "clsx";

const CurrentPlayerName = styled("h3")({
  writingMode: "vertical-lr",
  textOrientation: "upright"
});

const ReservedCards = styled(Row)({
  flexGrow: 1,
  "& > div:not(:first-child)": {
    marginLeft: "-3rem"
  },
  maxWidth: "15em",
  padding: "0 0.5rem",
  overflowY: "auto"
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
    className={clsx("user-player", { active: isCurrentPlayer })}
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
          fontSize="calc(100% + .5rem/6)"
          alignItems="center"
          width="3rem"
          padding="1rem 0"
        >
          <Tokens tokens={player.tokens} />
        </Column>
        <ReservedCards>
          {player.reservedCards.map(card => (
            <DevelopmentCard
              key={card.id}
              card={card}
              onSelected={onPlayReservedCard}
            />
          ))}
        </ReservedCards>
      </Row>
      <Row fontSize="5em">
        <GroupedDevelopmentCards cards={player.playedCards} />
      </Row>
    </Row>
  </Row>
);
