import React from "react";
import { Grid, Slider } from "@material-ui/core";
import { VolumeDown, VolumeUp, VolumeOffSharp } from "@material-ui/icons";

export const VolumeSlider = ({ value, onChange }) => (
  <Grid container spacing={2}>
    <Grid item>
      {value === 0 ? (
        <VolumeOffSharp />
      ) : (
        <VolumeDown onClick={() => onChange(0)} />
      )}
    </Grid>
    <Grid item xs>
      <Slider
        value={value}
        onChange={(_, value) => onChange(value)}
        aria-labelledby="continuous-slider"
      />
    </Grid>
    <Grid item>
      <VolumeUp onClick={() => onChange(100)} />
    </Grid>
  </Grid>
);
