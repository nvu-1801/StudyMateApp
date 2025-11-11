import { StyleSheet, Text, View } from "react-native";
import type { Session } from "../store/sessionSlice";

interface Props {
  sessions: Session[];
}

export const SummaryHeader = ({ sessions }: Props) => {
  if (sessions.length === 0)
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>No study sessions yet.</Text>
      </View>
    );

  // Lọc các buổi học trong 7 ngày gần nhất
  const now = new Date();
  const weekSessions = sessions.filter((s) => {
    const date = new Date(s.date);
    return now.getTime() - date.getTime() < 7 * 24 * 60 * 60 * 1000;
  });

  const totalMinutes = weekSessions.reduce((acc, s) => acc + s.duration, 0);
  const totalHours = (totalMinutes / 60).toFixed(1);
  const avgPerDay = (totalMinutes / 7).toFixed(1);

  // ...
  const courseCount: Record<string, number> = {};
  weekSessions.forEach((s) => {
    courseCount[s.course_name] = (courseCount[s.course_name] || 0) + s.duration;
  });
  const mostActive =
    Object.entries(courseCount).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "N/A";

  const completedCount = sessions.filter((s) => s.completion).length;
  const completionPercent = ((completedCount / sessions.length) * 100).toFixed(
    1
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📊 Study Summary</Text>
      <View style={styles.row}>
        <View style={styles.item}>
          <Text style={styles.label}>Total hours (week)</Text>
          <Text style={styles.value}>{totalHours}h</Text>
        </View>
        <View style={styles.item}>
          <Text style={styles.label}>Most active</Text>
          <Text style={styles.value}>{mostActive}</Text>
        </View>
      </View>

      <View style={styles.row}>
        <View style={styles.item}>
          <Text style={styles.label}>Completion</Text>
          <Text style={styles.value}>{completionPercent}%</Text>
        </View>
        <View style={styles.item}>
          <Text style={styles.label}>Avg/day</Text>
          <Text style={styles.value}>{avgPerDay} min</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#E8F5E9",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  title: { fontSize: 18, fontWeight: "600", marginBottom: 12 },
  row: { flexDirection: "row", justifyContent: "space-between" },
  item: { width: "48%" },
  label: { fontSize: 13, color: "#666" },
  value: { fontSize: 16, fontWeight: "600", color: "#2E7D32" },
  empty: {
    backgroundColor: "#F9F9F9",
    padding: 20,
    alignItems: "center",
    borderRadius: 12,
  },
  emptyText: { color: "#999" },
});
