import React, { useState } from "react";
import { Moves } from "./GameMoves";
import { ResourceType, DevelopmentCard, GameState } from "./model";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import { Grid, Paper, Typography, Container } from "@material-ui/core";
import { DevelopmentCardsSection } from "./DevelopmentCards";
import { TokensSection } from "./Tokens";
import { IBoardProps } from "boardgame.io/react";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      display: "flex",
      height: "100vh"
    },
    paper: {
      padding: theme.spacing(2),
      textAlign: "center",
      color: theme.palette.text.secondary
    }
  })
);

const canAffordCard = (playerId: string, card: DevelopmentCard) =>
  card && card.resourceType === ResourceType.Diamond;

export interface GameComponentProps extends IBoardProps<GameState> {
  moves: Moves;
}

export const MainBoard: React.FC<GameComponentProps> = props => {
  const {
    G,
    ctx,
    moves: {
      collectMultipleResources,
      collectSingleResource,
      purchaseDevelopmentCard,
      reserveDevelopmentCard
    }
  } = props;

  const classes = useStyles(props);

  const { availableCards } = G;

  const onResourceSelected = (type: ResourceType) => {
    G.currentPlayerTokens = G.currentPlayerTokens || [];
    const selectedTokens = G.currentPlayerTokens;

    if (selectedTokens.indexOf(type) > -1) {
      collectSingleResource(type);
      selectedTokens.splice(0, selectedTokens.length);
      return;
    } else if (selectedTokens.length === 2) {
      collectMultipleResources(selectedTokens);
      selectedTokens.splice(0, selectedTokens.length);
      return;
    }

    selectedTokens.push(type);
  };

  const onDevelopmentCardSelected = (card: DevelopmentCard) =>
    canAffordCard(ctx.currentPlayer, card)
      ? purchaseDevelopmentCard(card)
      : reserveDevelopmentCard(card);

  return (
    <>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
      />
      <Container className={classes.root}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper className={classes.paper}>
              <Typography variant="h1" component="h2">
                JSS DEMO
              </Typography>
            </Paper>
          </Grid>

          <Grid container xs={12} spacing={2}>
            <Grid item xs={9}>
              <Paper style={{ flexGrow: 1 }} className={classes.paper}>
                <Grid container>
                  <Grid item xs={10}>
                    <PatronsSection />
                    <DevelopmentCardsSection
                      levels={availableCards}
                      onDevelopmentCardSelected={onDevelopmentCardSelected}
                    />
                  </Grid>
                  <Grid item xs={2} justify="center">
                    <TokensSection onResourceSelected={onResourceSelected} />
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
            <Grid item xs={3} justify="center">
              <Paper className={classes.paper}>
                <PlayersPanel />
              </Paper>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Paper className={classes.paper}>
              <InventorySection />
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

const PlayersPanel: React.FC = () => <div>PLAYER INFO]</div>;
const PatronsSection: React.FC = () => <div>[PATRONS]</div>;
const InventorySection: React.FC = () => <div>[INVENTORY]</div>;
