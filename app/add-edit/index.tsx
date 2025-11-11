import DateTimePicker from "@react-native-community/datetimepicker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import type { AppDispatch, RootState } from "../../src/store";
import { addSession, updateSession } from "../../src/store/sessionSlice";

export default function AddEditSessionScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const existing = useSelector((s: RootState) =>
    s.session.sessions.find((item) => item.id === id)
  );

  const [courseName, setCourseName] = useState(existing?.course_name || "");
  const [duration, setDuration] = useState(
    existing?.duration?.toString() || ""
  );
  const [date, setDate] = useState(
    existing ? new Date(existing.date) : new Date()
  );
  const [notes, setNotes] = useState(existing?.notes || "");
  const [completion, setCompletion] = useState(existing?.completion || false);
  const [showPicker, setShowPicker] = useState(false);

  const handleSave = () => {
    if (!courseName || !duration) {
      alert("Please fill in all required fields");
      return;
    }

    const newSession = {
      id: existing?.id || uuidv4(),
      course_name: courseName,
      duration: parseInt(duration, 10),
      date: date.toISOString(),
      notes,
      completion,
    };

    if (existing) {
      dispatch(updateSession(newSession));
    } else {
      dispatch(addSession(newSession));
    }

    router.back();
  };

  return (
    <View style={styles.wrapper}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>
            {existing ? "✏️ Edit Session" : "➕ New Session"}
          </Text>
          <Text style={styles.subtitle}>
            {existing
              ? "Update your study details"
              : "Track your study progress"}
          </Text>
        </View>

        {/* Form Card */}
        <View style={styles.card}>
          {/* Course Name */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>📚 Course Name</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Mathematics, Physics..."
              placeholderTextColor="#999"
              value={courseName}
              onChangeText={setCourseName}
            />
          </View>

          {/* Duration */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>⏱️ Duration (minutes)</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., 60, 90, 120..."
              placeholderTextColor="#999"
              keyboardType="numeric"
              value={duration}
              onChangeText={setDuration}
            />
          </View>

          {/* Date */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>📅 Study Date</Text>
            <TouchableOpacity
              onPress={() => setShowPicker(true)}
              style={styles.dateButton}
              activeOpacity={0.7}
            >
              <Text style={styles.dateText}>{date.toDateString()}</Text>
              <Text style={styles.dateIcon}>📆</Text>
            </TouchableOpacity>
            {showPicker && (
              <DateTimePicker
                value={date}
                mode="date"
                display="default"
                onChange={(_, selectedDate) => {
                  setShowPicker(false);
                  if (selectedDate) setDate(selectedDate);
                }}
              />
            )}
          </View>

          {/* Notes */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>📝 Notes (optional)</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Write your notes here..."
              placeholderTextColor="#999"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              value={notes}
              onChangeText={setNotes}
            />
          </View>

          {/* Completion Toggle */}
          <View style={styles.toggleContainer}>
            <View style={styles.toggleLeft}>
              <Text style={styles.toggleIcon}>✅</Text>
              <View>
                <Text style={styles.toggleLabel}>Mark as Completed</Text>
                <Text style={styles.toggleHint}>
                  {completion ? "Session completed!" : "Not completed yet"}
                </Text>
              </View>
            </View>
            <Switch
              value={completion}
              onValueChange={setCompletion}
              trackColor={{ false: "#E0E0E0", true: "#81C784" }}
              thumbColor={completion ? "#4CAF50" : "#f4f3f4"}
              ios_backgroundColor="#E0E0E0"
            />
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSave}
            activeOpacity={0.8}
          >
            <Text style={styles.saveText}>
              {existing ? "💾 Update" : "💾 Save"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    color: "#666",
    fontWeight: "400",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    color: "#1A1A1A",
    borderWidth: 1,
    borderColor: "#E8E8E8",
  },
  textArea: {
    height: 100,
    paddingTop: 14,
  },
  dateButton: {
    backgroundColor: "#F8F9FA",
    borderWidth: 1,
    borderColor: "#E8E8E8",
    borderRadius: 12,
    padding: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dateText: {
    fontSize: 15,
    color: "#1A1A1A",
    fontWeight: "500",
  },
  dateIcon: {
    fontSize: 20,
  },
  toggleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: "#E8E8E8",
  },
  toggleLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  toggleIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  toggleLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
    marginBottom: 2,
  },
  toggleHint: {
    fontSize: 12,
    color: "#999",
  },
  buttonGroup: {
    flexDirection: "row",
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#FFF",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#E0E0E0",
  },
  cancelText: {
    color: "#666",
    fontWeight: "600",
    fontSize: 16,
  },
  saveButton: {
    flex: 1,
    backgroundColor: "#4CAF50",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#4CAF50",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  saveText: {
    color: "#FFF",
    fontWeight: "700",
    fontSize: 16,
  },
});
