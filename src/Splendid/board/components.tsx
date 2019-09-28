import { Box } from "@material-ui/core";
import { styled } from "@material-ui/styles";

export const Column = styled(Box)({ display: "flex", flexDirection: "column" });

export const Row = styled(Box)({ display: "flex", flexDirection: "row" });

export const Overlay = styled("div")({
  position: "absolute",
  top: 0,
  left: 0,
  width: "100vw",
  height: ({ isActive }: { isActive: boolean }) => `${isActive ? 100 : 0}vh`,
  zIndex: 1000
});
