import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { getData, saveData } from "@/src/utils/storage";
import { scheduleStudyReminder, cancelReminder } from "@/src/services/notificationService";
import type { RootState } from "./index";

export interface PlannerReminder {
  sessionKey: string;          // unique: course_name + date
  enabled: boolean;
  notificationId?: string | null;
  hour: number;                // giờ nhắc hằng ngày
  minute: number;              // phút nhắc hằng ngày
}

interface PlannerState {
  reminders: Record<string, PlannerReminder>; // map theo sessionKey
  initialized: boolean;
}

const initialState: PlannerState = {
  reminders: {},
  initialized: false,
};

const STORAGE_KEY = "planner_reminders_v1";

export const loadPlannerReminders = createAsyncThunk(
  "planner/load",
  async () => {
    const saved = await getData<Record<string, PlannerReminder>>(STORAGE_KEY);
    return saved ?? {};
  }
);

export const togglePlannerReminder = createAsyncThunk<
  { sessionKey: string; data: PlannerReminder },
  { sessionKey: string; courseName: string; dateISO: string },
  { state: RootState }
>(
  "planner/toggle",
  async ({ sessionKey, courseName, dateISO }, { getState }) => {
    const state = getState().planner;
    const existing = state.reminders[sessionKey];

    // Default nhắc 19:00 hàng ngày nếu chưa chọn
    const hour = existing?.hour ?? 19;
    const minute = existing?.minute ?? 0;

    if (existing?.enabled && existing.notificationId) {
      // Đang bật -> tắt và hủy lịch
      await cancelReminder(existing.notificationId);
      const updated: PlannerReminder = {
        sessionKey,
        enabled: false,
        notificationId: null,
        hour,
        minute,
      };
      return { sessionKey, data: updated };
    } else {
      // Đang tắt -> bật: đặt lịch hằng ngày vào giờ:phút
      const date = new Date(dateISO);
      date.setHours(hour, minute, 0, 0);
      const nid = await scheduleStudyReminder(courseName, date, true);
      const updated: PlannerReminder = {
        sessionKey,
        enabled: true,
        notificationId: nid,
        hour,
        minute,
      };
      return { sessionKey, data: updated };
    }
  }
);

export const setPlannerTime = createAsyncThunk<
  { sessionKey: string; data: PlannerReminder },
  { sessionKey: string; courseName: string; dateISO: string; hour: number; minute: number },
  { state: RootState }
>(
  "planner/setTime",
  async ({ sessionKey, courseName, dateISO, hour, minute }, { getState }) => {
    const state = getState().planner;
    const existing = state.reminders[sessionKey];

    // Nếu đang bật → hủy lịch cũ rồi tạo mới tại giờ:phút
    let notificationId: string | null | undefined = existing?.notificationId ?? null;
    if (existing?.enabled && notificationId) {
      await cancelReminder(notificationId);
      const date = new Date(dateISO);
      date.setHours(hour, minute, 0, 0);
      notificationId = await scheduleStudyReminder(courseName, date, true);
    }

    const updated: PlannerReminder = {
      sessionKey,
      enabled: existing?.enabled ?? false,
      notificationId,
      hour,
      minute,
    };
    return { sessionKey, data: updated };
  }
);

const plannerSlice = createSlice({
  name: "planner",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(loadPlannerReminders.fulfilled, (state, action) => {
      state.reminders = action.payload;
      state.initialized = true;
    });
    builder.addCase(togglePlannerReminder.fulfilled, (state, action) => {
      state.reminders[action.payload.sessionKey] = action.payload.data;
      saveData(STORAGE_KEY, state.reminders);
    });
    builder.addCase(setPlannerTime.fulfilled, (state, action) => {
      state.reminders[action.payload.sessionKey] = action.payload.data;
      saveData(STORAGE_KEY, state.reminders);
    });
  },
});

export default plannerSlice.reducer;
