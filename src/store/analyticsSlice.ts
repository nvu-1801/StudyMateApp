import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "./index";
import type { Session } from "./sessionSlice";

/** Lấy danh sách sessions */
const selectSessions = (s: RootState) => s.session.sessions;

/** Tính bucket 7 ngày gần nhất (Mon..Sun) cho "total phút học mỗi ngày" */
export const selectWeeklyMinutes = createSelector([selectSessions], (sessions: Session[]) => {
  const now = new Date();

  // Tính thứ 2 đầu tuần theo local time (Mon-based)
  const day = now.getDay(); // 0..6 (Sun..Sat)
  const diffToMonday = (day + 6) % 7; // Sun(0)->6, Mon(1)->0, ...
  const monday = new Date(now);
  monday.setHours(0, 0, 0, 0);
  monday.setDate(now.getDate() - diffToMonday);

  const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const minutes = Array(7).fill(0);

  for (const s of sessions) {
    const d = new Date(s.date);
    const dd = new Date(d);
    dd.setHours(0, 0, 0, 0);
    const idx = Math.floor((dd.getTime() - monday.getTime()) / (24 * 60 * 60 * 1000));
    if (idx >= 0 && idx < 7) {
      minutes[idx] += s.duration || 0;
    }
  }

  return { labels, minutes };
});

/** Tính % hoàn thành theo từng khoá học */
export const selectCompletionByCourse = createSelector([selectSessions], (sessions: Session[]) => {
  // Gom nhóm theo course_name
  const map: Record<string, { total: number; completed: number }> = {};
  for (const s of sessions) {
    const key = s.course_name;
    if (!map[key]) map[key] = { total: 0, completed: 0 };
    map[key].total += 1;
    if (s.completion) map[key].completed += 1;
  }

  const labels: string[] = [];
  const percents: number[] = [];

  Object.entries(map).forEach(([course, stat]) => {
    labels.push(course);
    const pct = stat.total ? (stat.completed / stat.total) * 100 : 0;
    percents.push(Number(pct.toFixed(1)));
  });

  // Nếu có quá nhiều nhãn, bạn có thể cắt ngắn ở UI
  return { labels, percents };
});
