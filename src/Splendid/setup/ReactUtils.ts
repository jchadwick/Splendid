import { useState } from "react";

export const selectAllText = (event: React.FocusEvent<any>) =>
  event.target.select();

export const useToggleState = (initialState = false): [boolean, () => void] => {
  const [state, setState] = useState(initialState);
  return [state, () => setState(!state)];
};
