import { createSlice } from "@reduxjs/toolkit";

interface AnalyticsState {
  totalMinutesPerDay: Record<string, number>;
  completionByCourse: Record<string, number>;
}

const initialState: AnalyticsState = {
  totalMinutesPerDay: {},
  completionByCourse: {},
};

const analyticsSlice = createSlice({
  name: "analytics",
  initialState,
  reducers: {
    setTotalMinutesPerDay: (state, action) => {
      state.totalMinutesPerDay = action.payload;
    },
    setCompletionByCourse: (state, action) => {
      state.completionByCourse = action.payload;
    },
    resetAnalytics: (state) => {
      state.totalMinutesPerDay = {};
      state.completionByCourse = {};
    },
  },
});

export const {
  setTotalMinutesPerDay,
  setCompletionByCourse,
  resetAnalytics,
} = analyticsSlice.actions;

export default analyticsSlice.reducer;
