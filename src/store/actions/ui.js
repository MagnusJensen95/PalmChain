import { SET_DRAWER_STATE } from "./types";

export const setDrawerOpen = open => {
  return {
    type: SET_DRAWER_STATE,
    drawerStatus: open
  };
};
