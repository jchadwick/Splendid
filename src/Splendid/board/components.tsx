import React from "react";
import { Box } from "@material-ui/core";
import { styled } from "@material-ui/styles";

export const Column = styled(Box)({ display: "flex", flexDirection: "column" });

export const Row = styled(Box)({ display: "flex", flexDirection: "row" });

interface OverlayProps {
  isActive: boolean;
  className?: string;
}
export const Overlay = styled(({ className }: OverlayProps) => (
  <div className={className} />
))({
  position: "absolute",
  top: 0,
  left: 0,
  width: "100vw",
  height: ({ isActive }) => `${isActive ? 100 : 0}vh`,
  zIndex: 1000
});
