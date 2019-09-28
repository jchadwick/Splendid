import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
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
    <DialogTitle>GAME OVER</DialogTitle>
    <DialogContent dividers>
      <Typography gutterBottom>
        {results.winner === userPlayer ? (
          <Typography>YOU WIN!</Typography>
        ) : (
          <Typography>You lose - get off my property</Typography>
        )}
      </Typography>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose} color="primary">
        New Game
      </Button>
    </DialogActions>
  </Dialog>
);
