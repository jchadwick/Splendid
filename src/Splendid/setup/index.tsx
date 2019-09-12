import React from "react";
import { GameSettings, GameSettingsStore } from "./GameSettingsStore";
import { action } from "mobx";
import { observer, useLocalStore } from "mobx-react-lite";
import { VolumeSlider } from "./VolumeSlider";
import { PlayerList } from "./PlayerList";
import {
  Container,
  FormLabel,
  Typography,
  Box,
  Dialog,
  makeStyles,
  createStyles,
  Button,
  styled
} from "@material-ui/core";
import { AddCircleOutline } from "@material-ui/icons";

const useStyles = makeStyles(
  createStyles({
    formLabel: {
      width: "10em"
    }
  })
);

const FormSection = styled("div")({
  margin: "1em 0 .5em 0"
});

const GameSetup = observer<{
  onReadyToStartGame(settings: GameSettings): void;
}>(({ onReadyToStartGame }) => {
  const classes = useStyles({});
  const settings = useLocalStore(() => new GameSettingsStore());

  const triggerStartGame = () => onReadyToStartGame(settings.toSettings());

  return (
    <Container>
      <Dialog open fullWidth>
        <Box display="flex" flexDirection="column" padding="2em">
          <Typography variant="h2" gutterBottom>
            Settings
          </Typography>

          <Box flexGrow={1} minHeight="25em">
            <FormSection>
              <FormLabel component="legend">Volume</FormLabel>
              <hr />
              <Box display="flex" flexDirection="row">
                <Typography className={classes.formLabel} gutterBottom>
                  Sound FX
                </Typography>
                <VolumeSlider
                  value={settings.sfxVolume}
                  onChange={action(val => (settings.sfxVolume = val))}
                />
              </Box>
              <Box display="flex" flexDirection="row">
                <Typography className={classes.formLabel} gutterBottom>
                  Music
                </Typography>
                <VolumeSlider
                  value={settings.musicVolume}
                  onChange={action(val => (settings.musicVolume = val))}
                />
              </Box>
            </FormSection>

            <FormSection>
              <FormLabel component="legend">Players</FormLabel>
              <hr />
              <PlayerList
                players={settings.players}
                onPlayerDeleted={settings.removePlayer}
                onPlayerUpdated={settings.updatePlayer}
              />
              {settings.canAddMorePlayers && (
                <Box display="flex" justifyContent="flex-end">
                  <Button
                    onClick={settings.addPlayerRow}
                    variant="outlined"
                    color="primary"
                    size="small"
                  >
                    <AddCircleOutline />
                    Add Player
                  </Button>
                </Box>
              )}
            </FormSection>
          </Box>
          <Box display="flex" justifyContent="flex-end">
            <Button
              onClick={triggerStartGame}
              color="primary"
              variant="contained"
              disabled={!settings.canStartGame}
              size="small"
            >
              Start Game
            </Button>
          </Box>
        </Box>
      </Dialog>
    </Container>
  );
});

GameSetup.displayName = "GameSetup";

export default GameSetup;
