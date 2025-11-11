import { requestNotificationPermission } from "@/src/services/notificationService";
import type { AppDispatch, RootState } from "@/src/store";
import {
  loadPlannerReminders,
  setPlannerTime,
  togglePlannerReminder,
} from "@/src/store/plannerSlice";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { format } from "date-fns";
import { useEffect, useMemo, useState } from "react";
import {
  FlatList,
  Platform,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";

export default function PlannerScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const { sessions } = useSelector((s: RootState) => s.session);
  const { reminders, initialized } = useSelector((s: RootState) => s.planner);

  const [timePickerFor, setTimePickerFor] = useState<string | null>(null);

  // Lọc những buổi học có ngày >= hôm nay
  const upcoming = useMemo(() => {
    const now = new Date();
    return sessions
      .filter(
        (s) =>
          new Date(s.date).getTime() >= new Date(now.toDateString()).getTime()
      )
      .sort((a, b) => +new Date(a.date) - +new Date(b.date));
  }, [sessions]);

  useEffect(() => {
    if (!initialized) {
      dispatch(loadPlannerReminders());
    }
  }, [initialized, dispatch]);

  useEffect(() => {
    requestNotificationPermission();
  }, []);

  const uniqueKey = (course_name: string, dateISO: string) =>
    `${course_name}-${dateISO}`;

  const renderItem = ({ item }: any) => {
    const key = uniqueKey(item.course_name, item.date);
    const r = reminders[key] ?? { enabled: false, hour: 19, minute: 0 };

    const timeLabel = `${String(r.hour).padStart(2, "0")}:${String(
      r.minute
    ).padStart(2, "0")}`;

    return (
      <View style={styles.card}>
        <View style={styles.cardLeft}>
          <View style={styles.iconContainer}>
            <Ionicons name="book" size={24} color="#4CAF50" />
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.course}>{item.course_name}</Text>
            <View style={styles.metaRow}>
              <View style={styles.metaItem}>
                <Ionicons name="time-outline" size={14} color="#666" />
                <Text style={styles.metaText}>{item.duration} min</Text>
              </View>
              <View style={styles.metaItem}>
                <Ionicons name="calendar-outline" size={14} color="#666" />
                <Text style={styles.metaText}>
                  {format(new Date(item.date), "dd/MM/yyyy")}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.rightCol}>
          <View style={styles.switchContainer}>
            <Text style={styles.switchLabel}>{r.enabled ? "On" : "Off"}</Text>
            <Switch
              value={!!r.enabled}
              onValueChange={() => {
                dispatch(
                  togglePlannerReminder({
                    sessionKey: key,
                    courseName: item.course_name,
                    dateISO: item.date,
                  })
                );
              }}
              trackColor={{ false: "#E0E0E0", true: "#81C784" }}
              thumbColor={r.enabled ? "#4CAF50" : "#f4f3f4"}
              ios_backgroundColor="#E0E0E0"
            />
          </View>

          <TouchableOpacity
            style={[styles.timeBtn, !r.enabled && styles.timeBtnDisabled]}
            onPress={() => setTimePickerFor(key)}
            disabled={!r.enabled}
            activeOpacity={0.7}
          >
            <Ionicons
              name="alarm-outline"
              size={16}
              color={r.enabled ? "#4CAF50" : "#999"}
            />
            <Text
              style={[styles.timeText, !r.enabled && styles.timeTextDisabled]}
            >
              {timeLabel}
            </Text>
          </TouchableOpacity>

          {timePickerFor === key && (
            <DateTimePicker
              value={new Date(2025, 0, 1, r.hour, r.minute, 0)}
              mode="time"
              is24Hour
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={(_, selected) => {
                setTimePickerFor(null);
                if (!selected) return;
                const hour = selected.getHours();
                const minute = selected.getMinutes();
                dispatch(
                  setPlannerTime({
                    sessionKey: key,
                    courseName: item.course_name,
                    dateISO: item.date,
                    hour,
                    minute,
                  })
                );
              }}
            />
          )}
        </View>
      </View>
    );
  };

  if (!upcoming.length) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#F8F9FA" />

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>📅 Study Planner</Text>
          <Text style={styles.headerSubtitle}>
            Manage your upcoming study sessions
          </Text>
        </View>

        <View style={styles.emptyState}>
          <Ionicons name="calendar-outline" size={80} color="#E0E0E0" />
          <Text style={styles.emptyTitle}>No Upcoming Sessions</Text>
          <Text style={styles.emptyText}>
            You don't have any planned study sessions yet. Add new sessions to
            get started!
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F9FA" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>📅 Study Planner</Text>
        <Text style={styles.headerSubtitle}>
          {upcoming.length} upcoming session{upcoming.length !== 1 ? "s" : ""}
        </Text>
      </View>

      {/* List */}
      <FlatList
        data={upcoming}
        keyExtractor={(it, idx) => `${it.course_name}-${it.date}-${idx}`}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  header: {
    backgroundColor: "#FFF",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1A1A1A",
    marginTop: 16,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 15,
    color: "#666",
    fontWeight: "400",
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  card: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  cardLeft: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#E8F5E9",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  cardContent: {
    flex: 1,
  },
  course: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1A1A1A",
    marginBottom: 6,
  },
  metaRow: {
    flexDirection: "row",
    gap: 12,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metaText: {
    fontSize: 13,
    color: "#666",
  },
  rightCol: {
    alignItems: "flex-end",
    gap: 8,
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  switchLabel: {
    fontSize: 13,
    color: "#666",
    fontWeight: "500",
  },
  timeBtn: {
    backgroundColor: "#E8F5E9",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderWidth: 1,
    borderColor: "#C8E6C9",
  },
  timeBtnDisabled: {
    backgroundColor: "#F5F5F5",
    borderColor: "#E0E0E0",
  },
  timeText: {
    color: "#4CAF50",
    fontWeight: "600",
    fontSize: 14,
  },
  timeTextDisabled: {
    color: "#999",
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1A1A1A",
    marginTop: 20,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 15,
    color: "#666",
    textAlign: "center",
    lineHeight: 22,
  },
});
