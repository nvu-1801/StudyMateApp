import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchCourses } from "../services/api";
import { getData, saveData } from "../utils/storage";

export interface Session {
  id?: string; // mock data có thể chưa có id
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
  reducers: {},
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

export default sessionSlice.reducer;
