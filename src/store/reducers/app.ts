import { createReducer } from "@reduxjs/toolkit";
import { AppState } from "../../types/State";
import { setStateError, setStateSuccess, setGuestMode } from "../actions";

const initialState: AppState = {
  error: null,
  success: null,
  isGuestMode: typeof window !== "undefined" && localStorage.getItem("amishav-guest-mode") === "true",
};

export const AppReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(setStateError, (state, action) => {
      state.error = action.payload.message;
    })
    .addCase(setStateSuccess, (state, action) => {
      state.success = action.payload.message;
    })
    .addCase(setGuestMode, (state, action) => {
      state.isGuestMode = action.payload.isGuestMode;
    })
});
