import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { useEffect } from "react";
import {
  ActivityIndicator,
  FlatList,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { SessionItem } from "../src/components/SessionItem";
import { SummaryHeader } from "../src/components/SummaryHeader";
import type { AppDispatch, RootState } from "../src/store";
import { fetchSessions } from "../src/store/sessionSlice";

export default function HomeScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const { sessions, loading, error } = useSelector((s: RootState) => s.session);

  useEffect(() => {
    dispatch(fetchSessions());
  }, [dispatch]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Loading your sessions...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Ionicons name="alert-circle-outline" size={64} color="#FF5252" />
        <Text style={styles.errorTitle}>Oops! Something went wrong</Text>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => dispatch(fetchSessions())}
        >
          <Text style={styles.retryText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F9FA" />

      {/* Header Section */}
      <View style={styles.headerContainer}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.greeting}>Hello! 👋</Text>
            <Text style={styles.welcomeText}>
              Let's track your study progress
            </Text>
          </View>
        </View>

        <SummaryHeader sessions={sessions} />
      </View>

      {/* Add Button */}
      <View style={styles.actionBar}>
        <Text style={styles.sectionTitle}>Recent Sessions</Text>
        <Link href="/add-edit" asChild>
          <TouchableOpacity style={styles.addButton} activeOpacity={0.8}>
            <Ionicons name="add-circle" color="#FFF" size={20} />
            <Text style={styles.addButtonText}>Add New</Text>
          </TouchableOpacity>
        </Link>
      </View>

      {/* Sessions List */}
      {sessions.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="book-outline" size={80} color="#E0E0E0" />
          <Text style={styles.emptyTitle}>No sessions yet</Text>
          <Text style={styles.emptyText}>
            Start tracking your study sessions by tapping the "Add New" button
          </Text>
        </View>
      ) : (
        <FlatList
          data={sessions}
          keyExtractor={(item, index) =>
            `${item.course_name}-${item.date}-${index}`
          }
          renderItem={({ item }) => <SessionItem session={item} />}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F8F9FA",
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#666",
    fontWeight: "500",
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1A1A1A",
    marginTop: 16,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: "#4CAF50",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  retryText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
  headerContainer: {
    backgroundColor: "#FFF",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
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
  headerTop: {
    marginTop: 16,
    marginBottom: 20,
  },
  greeting: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 4,
  },
  welcomeText: {
    fontSize: 15,
    color: "#666",
    fontWeight: "400",
  },
  actionBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1A1A1A",
  },
  addButton: {
    backgroundColor: "#4CAF50",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
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
  addButtonText: {
    color: "#FFF",
    fontSize: 15,
    fontWeight: "600",
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
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
