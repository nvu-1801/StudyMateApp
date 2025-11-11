import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { fetchCourses } from "../services/api";
import { saveData, getData } from "../utils/storage";

export interface Session {
  id: string;
  course_name: string;
  duration: number;
  date: string;
  notes?: string;
  completion: boolean;
}

interface SessionState {
  sessions: Session[];
  loading: boolean;
  error: string | null;
}

const initialState: SessionState = {
  sessions: [],
  loading: false,
  error: null,
};

export const fetchSessions = createAsyncThunk("session/fetch", async () => {
  const cached = await getData<Session[]>("sessions");
  if (cached && cached.length > 0) return cached;

  const data = await fetchCourses();
  await saveData("sessions", data);
  return data;
});

const sessionSlice = createSlice({
  name: "session",
  initialState,
  reducers: {
    addSession: (state, action: PayloadAction<Session>) => {
      state.sessions.push(action.payload);
      saveData("sessions", state.sessions);
    },
    updateSession: (state, action: PayloadAction<Session>) => {
      const index = state.sessions.findIndex(
        (s) => s.id === action.payload.id
      );
      if (index !== -1) {
        state.sessions[index] = action.payload;
        saveData("sessions", state.sessions);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSessions.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSessions.fulfilled, (state, action) => {
        state.sessions = action.payload;
        state.loading = false;
      })
      .addCase(fetchSessions.rejected, (state, action) => {
        state.error = action.error.message ?? "Unknown error";
        state.loading = false;
      });
  },
});

export const { addSession, updateSession } = sessionSlice.actions;
export default sessionSlice.reducer;
