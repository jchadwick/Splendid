import React, { useState } from "react";
import * as Model from "./model";
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { Grid, Paper, Typography, Card, Box } from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      display: "flex",
      height: "100vh"
    },
    paper: {
      padding: theme.spacing(2),
      textAlign: 'center',
      color: theme.palette.text.secondary,
    },
  }),
);

export const MainBoard: React.FC<Model.GameComponentProps> = props => {
  const { G: { availableCards, availableTokens }, moves: { collectSingleResource, reserveDevelopmentCard } } = props;
  const classes = useStyles(props);

  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper className={classes.paper}>
            <Typography variant="h1" component="h2">JSS DEMO</Typography>
          </Paper>
        </Grid>
        <Grid item xs={9}>
          <Paper style={{ flexGrow: 1 }} className={classes.paper}>
            <PatronsSection />
            <DevelopmentCardsSection levels={availableCards} onDevelopmentCardSelected={card => reserveDevelopmentCard(card)} />
            <TokensSection onResourceSelected={type => collectSingleResource(type)} />
          </Paper>
        </Grid>
        <Grid item xs={3}>
          <Paper className={classes.paper}>
            <PlayersPanel />
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper className={classes.paper}>
            <InventorySection />
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
};

const PlayersPanel: React.FC = () => <div>PLAYER INFO]</div>;
const PatronsSection: React.FC = () => <div>[PATRONS]</div>;

const TokenStack: React.FC<{ resourceType: Model.ResourceType, onResourceSelected?(type: Model.ResourceType): void }> = ({ resourceType, onResourceSelected }) => 
  <div onClick={() => onResourceSelected(resourceType)} style={{ background: "white", border: "1px solid #333", borderRadius: 20, width: 40, height: 40 }}>
    [{resourceType}]
  </div>;

const TokensSection: React.FC<{ onResourceSelected?(type: Model.ResourceType): void }> = ({ onResourceSelected }) => 
  <Grid container xs={3}>
    <Box flex flexDirection="column">
      <Box>
        {Model.NativeResourceTypes.map((type) => (
          <TokenStack onResourceSelected={onResourceSelected} resourceType={Model.ResourceType[type]} />
        ))}
      </Box>
    </Box>
  </Grid>;

interface DevelopmentCardsSectionProps extends OnDevelopmentCardSelected {
  levels: Model.DevelopmentCardRow[];
}

const DevelopmentCardsSection: React.FC<DevelopmentCardsSectionProps> = ({
  levels, onDevelopmentCardSelected
}) => (
  <Grid container>
    {levels.map(x => (
      <DevelopmentCardRow key={`Level${x.level}`} row={x} onDevelopmentCardSelected={onDevelopmentCardSelected} />
    ))}
  </Grid>
);

interface OnDevelopmentCardSelected {
  onDevelopmentCardSelected?(card: Model.DevelopmentCard): void;
}

interface DevelopmentCardRowProps extends OnDevelopmentCardSelected {
  row: Model.DevelopmentCardRow;
}

const DevelopmentCardRow: React.FC<DevelopmentCardRowProps> = ({ 
  row: {
    level,
    stock,
    visibleCards
  }, 
  onDevelopmentCardSelected
}) => (
  <Grid item xs={12}>
      <Box display="flex" flexDirection="row">
      <Card>
        <h2>LEVEL {level}</h2>
        [STOCK: {stock.length}]
        </Card>
      <Box display="flex" flexDirection="row">
        {visibleCards.map(card => (
          <DevelopmentCard 
            key={`${level}${card.id}`} 
            card={card} 
            onDevelopmentCardSelected={onDevelopmentCardSelected} 
          />))}
      </Box>
      </Box>
  </Grid>
);

interface DevelopmentCardProps extends OnDevelopmentCardSelected {
  card: Model.DevelopmentCard;
}

const DevelopmentCard: React.FC<DevelopmentCardProps> = ({card, onDevelopmentCardSelected }) => 
<Card onClick={() => onDevelopmentCardSelected ? onDevelopmentCardSelected(card) : false}>
  [{card.resourceType}] ({JSON.stringify(card.cost)})
</Card>  

const InventorySection: React.FC = () => <div>[INVENTORY]</div>;
