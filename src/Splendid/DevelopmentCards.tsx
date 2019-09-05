import React from "react";
import * as Model from "./model";
import {
  Grid,
  Card,
  Box,
  Paper,
  makeStyles,
  createStyles
} from "@material-ui/core";
import { ResourceColors } from "./ResourceColors";

interface DevelopmentCardsSectionProps extends OnDevelopmentCardSelected {
  levels: Model.DevelopmentCardRow[];
}

export const DevelopmentCardsSection: React.FC<
  DevelopmentCardsSectionProps
> = ({ levels, onDevelopmentCardSelected }) => (
  <Grid container xs={12} spacing={2}>
    {levels.map(x => (
      <DevelopmentCardRow
        key={`Level${x.level}`}
        row={x}
        onDevelopmentCardSelected={onDevelopmentCardSelected}
      />
    ))}
  </Grid>
);

interface OnDevelopmentCardSelected {
  onDevelopmentCardSelected?(card: Model.DevelopmentCard): void;
}

interface DevelopmentCardRowProps extends OnDevelopmentCardSelected {
  row: Model.DevelopmentCardRow;
}

export const DevelopmentCardRow: React.FC<DevelopmentCardRowProps> = ({
  row: { level, stock, visibleCards },
  onDevelopmentCardSelected
}) => (
  <Grid item xs={12} spacing={2}>
    <Box display="flex" flexDirection="row">
      <Card className={useCardStyle({}).card}>
        <h2>LEVEL {level}</h2>
        [STOCK: {stock.length}]
      </Card>
      {visibleCards.map(card => (
        <DevelopmentCard
          key={`${level}${card.id}`}
          card={card}
          onDevelopmentCardSelected={onDevelopmentCardSelected}
        />
      ))}
    </Box>
  </Grid>
);

const useCardStyle = makeStyles({
  card: {
    cursor: "pointer",
    margin: "0px 10px",
    width: 120,
    height: 150
  }
});

interface DevelopmentCardProps extends OnDevelopmentCardSelected {
  card: Model.DevelopmentCard;
}

export const DevelopmentCard: React.FC<DevelopmentCardProps> = props => (
  <Card
    className={useCardStyle(props).card}
    onClick={() =>
      props.onDevelopmentCardSelected
        ? props.onDevelopmentCardSelected(props.card)
        : false
    }
  >
    [{props.card.resourceType}] ({JSON.stringify(props.card.cost)})
  </Card>
);
