import React from "react";
import { Moves } from "../game/GameMoves";
import { ResourceType, DevelopmentCard, GameState, Player } from "../model";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import { Grid, Paper, Typography, Container, Box } from "@material-ui/core";
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

export const MainBoard: React.FC<IBoardProps<GameState, Moves>> = props => {
  const {
    G,
    ctx,
    moves: {
      collectMultipleResources,
      collectSingleResource,
      purchaseDevelopmentCard,
      reserveDevelopmentCard
    },
    playerID
  } = props;

  const classes = useStyles(props);

  const { availableCards, availableTokens } = G;
  const player = G.players.find(x => x.id === playerID);

  const onResourceSelected = (type: ResourceType) => {
    G.currentPlayerTokens = G.currentPlayerTokens || [];
    const selectedTokens = G.currentPlayerTokens;

    // has the token been selected already?
    const duplicateToken = selectedTokens.indexOf(type) > -1;

    if (duplicateToken) {
      // if this is the second token being taken,
      // then take it as a single resource
      if (selectedTokens.length === 1) {
        collectSingleResource(type);
        selectedTokens.splice(0, selectedTokens.length);
        return;
      } else {
        // otherwise it's an invalid move so ignore it
        console.warn("Ignoring duplicate token");
        return;
      }
    }

    // if this is the third (unique) token selected,
    // call the collect multiple resource action
    if (selectedTokens.length === 2) {
      collectMultipleResources([...selectedTokens, type]);
      selectedTokens.splice(0, selectedTokens.length);
      return;
    }

    // no?  then just add it to the collection
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
              <Typography variant="h2" component="h2">
                JSS DEMO
              </Typography>
            </Paper>
          </Grid>

          <Grid container spacing={2}>
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
                  <Grid item xs={2}>
                    <TokensSection
                      tokens={availableTokens}
                      canSelectResource={() => true}
                      onResourceSelected={onResourceSelected}
                    />
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
            <Grid item xs={3}>
              <Paper className={classes.paper}>
                <PlayersPanel />
              </Paper>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Paper className={classes.paper}>
              <InventorySection player={player} />
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

const PlayersPanel: React.FC = () => <div>PLAYER INFO]</div>;
const PatronsSection: React.FC = () => <div>[PATRONS]</div>;

interface InventorySectionProps {
  player: Player;
}
const InventorySection: React.FC<InventorySectionProps> = ({ player }) => (
  <Box display="flex" flexDirection="row">
    <Box>[Cards]</Box>
    <Box>
      <TokensSection
        direction="row"
        canSelectResource={() => false}
        tokens={player && player.tokens}
      />
    </Box>
  </Box>
);
