import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "@reduxjs/toolkit";
import userSlice from "./slices/userSlice";
import surveySlice from "./slices/surveySlice";
import recommendationSlice from "./slices/recommendationSlice";

// Redux Persist removed - using custom localStorage logic for per-user survey answers

const rootReducer = combineReducers({
  user: userSlice,
  survey: surveySlice,
  recommendation: recommendationSlice,
});

export const store = configureStore({
  reducer: rootReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
