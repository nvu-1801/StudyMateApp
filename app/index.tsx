import { useEffect } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
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

  if (loading)
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text>Loading sessions...</Text>
      </View>
    );

  if (error)
    return (
      <View style={styles.center}>
        <Text style={{ color: "red" }}>Error: {error}</Text>
      </View>
    );

  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: "#F5F5F5" }}>
      <SummaryHeader sessions={sessions} />
      <FlatList
        data={sessions}
        keyExtractor={(item, index) =>
          `${item.course_name}-${item.date}-${index}`
        }
        renderItem={({ item }) => <SessionItem session={item} />}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
});
