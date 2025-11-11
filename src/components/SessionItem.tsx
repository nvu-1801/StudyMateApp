import { format } from "date-fns";
import { CheckCircle, Clock } from "lucide-react-native";
import { StyleSheet, Text, View } from "react-native";
import type { Session } from "../store/sessionSlice";

export const SessionItem = ({ session }: { session: Session }) => {
  const dateStr = format(new Date(session.date), "dd/MM/yyyy");

  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <Text style={styles.course}>{session.course_name}</Text>
        <Text style={styles.meta}>
          {session.duration} phút • {dateStr}
        </Text>
        {session.notes ? (
          <Text style={styles.notes}>{session.notes}</Text>
        ) : null}
      </View>

      <View style={styles.right}>
        {session.completion ? (
          <CheckCircle stroke="#4CAF50" size={24} />
        ) : (
          <Clock stroke="#FFB300" size={24} />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFF",
    padding: 14,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 1,
  },
  left: { flex: 1 },
  right: { marginLeft: 8 },
  course: { fontSize: 16, fontWeight: "600", color: "#222" },
  meta: { fontSize: 13, color: "#666", marginTop: 2 },
  notes: { fontSize: 13, color: "#888", marginTop: 4 },
});
