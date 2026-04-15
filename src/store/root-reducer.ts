import { combineReducers } from "redux";
import { DataReducer } from "./reducers/data";

export const rootReducer = combineReducers({
  data: DataReducer,
})

export type RootState = ReturnType<typeof rootReducer>;
