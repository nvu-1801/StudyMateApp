import { createSlice } from "@reduxjs/toolkit";

interface PlannerState {
  reminders: any[];
}

const initialState: PlannerState = {
  reminders: [],
};

const plannerSlice = createSlice({
  name: "planner",
  initialState,
  reducers: {
    addReminder: (state, action) => {
      state.reminders.push(action.payload);
    },
    removeReminder: (state, action) => {
      state.reminders = state.reminders.filter(
        (r) => r.id !== action.payload
      );
    },
    clearReminders: (state) => {
      state.reminders = [];
    },
  },
});

export const { addReminder, removeReminder, clearReminders } =
  plannerSlice.actions;

export default plannerSlice.reducer;
