import { Box, makeStyles, createStyles } from "@material-ui/core";
import React from "react";
import * as Model from "../../Model";
import { Column, Row } from "./components";
import { GroupedDevelopmentCards } from "./GroupedDevelopmentCards";
import { Tokens } from "./Tokens";
import { withStyles, WithStyles } from "@material-ui/styles";
import clsx from "clsx";

const styles = createStyles({
  name: { flexGrow: 1 },
  player: {},
  tokens: { fontSize: "0.5rem", fontWeight: "bold" },
  cards: { marginTop: ".1rem", fontSize: "1.5rem", minHeight: "3rem" },
  reservedCardStack: {
    bgcolor: "#ccc",
    position: "relative",
    fontWeight: 600,
    justifyContent: "center",
    alignContent: "center"
  }
});

const useStyles = makeStyles(styles);

export const PlayerList = ({ players, currentPlayer }) => {
  const classes = useStyles({});
  return (
    <>
      {players.map((player: Model.Player) => (
        <PlayerOverview
          key={player.id}
          classes={classes}
          isCurrentPlayer={player === currentPlayer}
          player={player}
        />
      ))}
    </>
  );
};

interface PlayerOverviewProps extends WithStyles<typeof styles> {
  isCurrentPlayer: boolean;
  player: Model.Player;
}

const PlayerOverview = withStyles(styles)(
  ({ classes, isCurrentPlayer, player }: PlayerOverviewProps) => (
    <Column
      className={clsx(classes.player, "player", { active: isCurrentPlayer })}
      itemScope
      itemType="urn:x:player"
      itemID={String(player.id)}
    >
      <Row>
        <Box className={classes.name} itemProp="name">
          {player.name}
        </Box>
        <Box fontWeight={800}>{player.prestigePoints}</Box>
      </Row>
      <Row className={classes.tokens}>
        <Tokens tokens={player.tokens} />
      </Row>
      <Row className={classes.cards}>
        <Column className={clsx("cardStack", classes.reservedCardStack)}>
          {(player.reservedCards && player.reservedCards.length) || 0}
        </Column>
        <GroupedDevelopmentCards cards={player.playedCards} />
      </Row>
    </Column>
  )
);
