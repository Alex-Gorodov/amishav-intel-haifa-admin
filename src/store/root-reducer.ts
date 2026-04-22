import { combineReducers } from "redux";
import { DataReducer } from "./reducers/data";
import { AppReducer } from "./reducers/app";

export const rootReducer = combineReducers({
  data: DataReducer,
  app: AppReducer
})

export type RootState = ReturnType<typeof rootReducer>;
