import { configureStore } from "@reduxjs/toolkit";
import sessionReducer from "./sessionSlice";
import plannerReducer from "./plannerSlice";
import analyticsReducer from "./analyticsSlice";

export const store = configureStore({
  reducer: {
    session: sessionReducer,
    planner: plannerReducer,
    analytics: analyticsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
