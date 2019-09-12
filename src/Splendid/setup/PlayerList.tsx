import React, { useState } from "react";
import { Player } from "./GameSettingsStore";
import { observer } from "mobx-react-lite";
import { selectAllText, useToggleState } from "./ReactUtils";
import { createViewModel, IViewModel } from "mobx-utils";
import {
  ListItem,
  ListItemText,
  ListItemIcon,
  List,
  ListItemSecondaryAction,
  IconButton,
  Input
} from "@material-ui/core";
import { Person, PersonOutline, RemoveCircle } from "@material-ui/icons";

interface PlayerListProps {
  players: Player[];
  onPlayerDeleted(id: string): void;
  onPlayerUpdated(player: Player, values: Map<keyof Player, any>): void;
}

export const PlayerList = observer<PlayerListProps>(
  ({ players, onPlayerDeleted, onPlayerUpdated }) => (
    <List>
      {players.map(player => (
        <PlayerListItem
          key={player.id}
          player={player}
          onPlayerDeleted={onPlayerDeleted}
          onPlayerUpdated={onPlayerUpdated}
        />
      ))}
    </List>
  )
);
const PlayerIsHumanIcon = observer<{ player: Player }>(({ player }) =>
  player.isHuman ? <Person /> : <PersonOutline />
);

interface PlayerListItemProps {
  player: Player;
  onPlayerDeleted(id: string): void;
  onPlayerUpdated(player: Player, values: Map<keyof Player, any>): void;
}

const PlayerListItem = observer<PlayerListItemProps>(
  ({ player, onPlayerDeleted, onPlayerUpdated }) => {
    const [isEditing, toggleEditing] = useToggleState(false);

    const handlePlayerUpdated = (...args) => {
      toggleEditing();
      onPlayerUpdated.apply(null, args as any);
    };

    return isEditing ? (
      <PlayerListItemEditView
        {...{ player, onPlayerDeleted, onPlayerUpdated: handlePlayerUpdated }}
      />
    ) : (
      <PlayerListItemReadonlyView
        {...{ player, onPlayerDeleted, onEdit: toggleEditing }}
      />
    );
  }
);

type PlayerListItemReadonlyViewProps = Omit<
  PlayerListItemProps,
  "onPlayerUpdated"
> & {
  onEdit(): void;
};

const PlayerListItemReadonlyView = observer<PlayerListItemReadonlyViewProps>(
  ({ player, onEdit, onPlayerDeleted }) => (
    <ListItem>
      <ListItemText onClick={() => onEdit()}>{player.name}</ListItemText>
      <ListItemIcon onClick={() => player.toggleIsHuman()}>
        <PlayerIsHumanIcon player={player} />
      </ListItemIcon>
      <ListItemSecondaryAction>
        <IconButton onClick={() => onPlayerDeleted(player.id)}>
          <RemoveCircle style={{ color: "red" }} />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  )
);

const PlayerListItemEditView = observer<PlayerListItemProps>(
  ({ player, onPlayerDeleted: onDeleted, onPlayerUpdated: onUpdated }) => {
    const [playerVm] = useState<IViewModel<Player>>(() =>
      createViewModel(player)
    );

    const onChange = ({
      target: { name, value }
    }: React.ChangeEvent<HTMLInputElement>) => (playerVm.model[name] = value);

    const onBlur = () => {
      onUpdated(player, playerVm.changedValues);
      playerVm.reset();
    };

    return (
      <ListItem>
        <ListItemText>
          <Input
            name="name"
            value={playerVm.model.name}
            onChange={onChange}
            onFocusCapture={selectAllText}
            onBlurCapture={onBlur}
          />
        </ListItemText>
        <ListItemIcon onClick={() => playerVm.model.toggleIsHuman()}>
          <PlayerIsHumanIcon player={playerVm.model} />
        </ListItemIcon>
        <ListItemSecondaryAction>
          <IconButton onClick={() => onDeleted(playerVm.model.id)}>
            <RemoveCircle style={{ color: "red" }} />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
    );
  }
);
