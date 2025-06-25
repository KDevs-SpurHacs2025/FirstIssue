import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { combineReducers } from "@reduxjs/toolkit";
import userSlice from "./slices/userSlice";
import surveySlice from "./slices/surveySlice";
import recommendationSlice from "./slices/recommendationSlice";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["user", "survey"], // userId와 survey 데이터 모두 localStorage에 저장
};

const rootReducer = combineReducers({
  user: userSlice,
  survey: surveySlice,
  recommendation: recommendationSlice, // recommendation은 세션 스토리지에만 저장
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
