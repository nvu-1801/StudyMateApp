import type { RootState } from "@/src/store";
import {
  selectCompletionByCourse,
  selectWeeklyMinutes,
} from "@/src/store/analyticsSlice";
import { Ionicons } from "@expo/vector-icons";
import {
  Dimensions,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { BarChart, LineChart } from "react-native-chart-kit";
import { useSelector } from "react-redux";

export default function AnalyticsScreen() {
  const { labels, minutes } = useSelector((s: RootState) =>
    selectWeeklyMinutes(s)
  );
  const { labels: courseLabels, percents } = useSelector((s: RootState) =>
    selectCompletionByCourse(s)
  );

  const width = Dimensions.get("window").width - 40; // padding 20 hai bên

  const chartConfig = {
    backgroundGradientFrom: "#FFFFFF",
    backgroundGradientTo: "#FFFFFF",
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(102, 102, 102, ${opacity})`,
    propsForDots: {
      r: "5",
      strokeWidth: "2",
      stroke: "#4CAF50",
    },
    propsForBackgroundLines: {
      strokeDasharray: "5 5",
      stroke: "#E0E0E0",
      strokeWidth: 1,
    },
    fillShadowGradient: "#4CAF50",
    fillShadowGradientOpacity: 0.3,
  };

  const hasWeekData = minutes.reduce((a, b) => a + b, 0) > 0;
  const hasCourseData = courseLabels.length > 0 && percents.some((v) => v > 0);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F9FA" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>📊 Analytics</Text>
        <Text style={styles.headerSubtitle}>Track your study progress</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Weekly Minutes Chart */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardTitleContainer}>
              <Ionicons name="trending-up" size={20} color="#4CAF50" />
              <Text style={styles.cardTitle}>Weekly Study Time</Text>
            </View>
            <Text style={styles.cardSubtitle}>Minutes per day</Text>
          </View>

          {!hasWeekData ? (
            <View style={styles.emptyState}>
              <Ionicons name="calendar-outline" size={48} color="#E0E0E0" />
              <Text style={styles.emptyTitle}>No Data Yet</Text>
              <Text style={styles.emptyText}>
                Start tracking your study sessions to see weekly progress
              </Text>
            </View>
          ) : (
            <View style={styles.chartContainer}>
              <LineChart
                data={{ labels, datasets: [{ data: minutes }] }}
                width={width}
                height={220}
                chartConfig={chartConfig}
                bezier
                style={styles.chart}
                fromZero
                yAxisSuffix="m"
              />
            </View>
          )}
        </View>

        {/* Completion by Course Chart */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardTitleContainer}>
              <Ionicons name="checkmark-done" size={20} color="#4CAF50" />
              <Text style={styles.cardTitle}>Course Completion</Text>
            </View>
            <Text style={styles.cardSubtitle}>Completion rate by course</Text>
          </View>

          {!hasCourseData ? (
            <View style={styles.emptyState}>
              <Ionicons name="book-outline" size={48} color="#E0E0E0" />
              <Text style={styles.emptyTitle}>No Course Data</Text>
              <Text style={styles.emptyText}>
                Complete study sessions to track course progress
              </Text>
            </View>
          ) : (
            <View style={styles.chartContainer}>
              <BarChart
                data={{
                  labels: courseLabels.map((l) =>
                    l.length > 8 ? l.slice(0, 8) + "…" : l
                  ),
                  datasets: [{ data: percents }],
                }}
                width={width}
                height={260}
                chartConfig={chartConfig}
                style={styles.chart}
                fromZero
                yAxisLabel=""
                yAxisSuffix="%"
                showValuesOnTopOfBars={Platform.OS !== "web"}
              />
            </View>
          )}
        </View>

        {/* Stats Summary */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Ionicons name="time-outline" size={24} color="#4CAF50" />
            <Text style={styles.statValue}>
              {minutes.reduce((a, b) => a + b, 0)}
            </Text>
            <Text style={styles.statLabel}>Total Minutes</Text>
          </View>

          <View style={styles.statCard}>
            <Ionicons name="book-outline" size={24} color="#4CAF50" />
            <Text style={styles.statValue}>{courseLabels.length}</Text>
            <Text style={styles.statLabel}>Courses</Text>
          </View>

          <View style={styles.statCard}>
            <Ionicons
              name="checkmark-circle-outline"
              size={24}
              color="#4CAF50"
            />
            <Text style={styles.statValue}>
              {percents.length > 0
                ? Math.round(
                    percents.reduce((a, b) => a + b, 0) / percents.length
                  )
                : 0}
              %
            </Text>
            <Text style={styles.statLabel}>Avg Completion</Text>
          </View>
        </View>
      </ScrollView>
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
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
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
  cardHeader: {
    marginBottom: 16,
  },
  cardTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1A1A1A",
  },
  cardSubtitle: {
    fontSize: 13,
    color: "#666",
    fontWeight: "400",
  },
  chartContainer: {
    alignItems: "center",
    marginTop: 8,
  },
  chart: {
    borderRadius: 12,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1A1A1A",
    marginTop: 12,
    marginBottom: 6,
  },
  emptyText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    lineHeight: 20,
    paddingHorizontal: 20,
  },
  statsContainer: {
    flexDirection: "row",
    gap: 12,
    marginTop: 4,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  statValue: {
    fontSize: 24,
    fontWeight: "700",
    color: "#4CAF50",
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
    fontWeight: "500",
    textAlign: "center",
  },
});
