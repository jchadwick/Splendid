import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  Typography
} from "@material-ui/core";
import React from "react";
import { GameResults, Player } from "../../Model";

interface GameOverProps {
  userPlayer: Player;
  results: GameResults;
  onClose(): any;
}

export const GameOver = ({ results, onClose, userPlayer }: GameOverProps) => (
  <Dialog open onClose={onClose} aria-labelledby="customized-dialog-title">
    <DialogTitle>
      {results.winner === userPlayer ? (
        <Typography variant="h3">YOU WIN!</Typography>
      ) : (
        <Typography variant="h3">You Lose!</Typography>
      )}
    </DialogTitle>
    <DialogContent dividers>
      <Typography gutterBottom variant="h4">
        Player Rankings
      </Typography>
      <List>
        {results.rankings.map((player, idx) => (
          <ListItem
            key={player.id}
            style={{
              fontWeight: 800,
              color: player === userPlayer ? "blue" : ""
            }}
          >
            <ListItemIcon>
              <span>{idx + 1}</span>
            </ListItemIcon>
            <ListItemText primary={player.name} />
            <ListItemSecondaryAction>
              {player.prestigePoints}
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose} color="primary">
        New Game
      </Button>
    </DialogActions>
  </Dialog>
);
