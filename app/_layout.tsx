import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { Platform } from "react-native";
import { Provider } from "react-redux";
import { store } from "../src/store";

export default function RootLayout() {
  return (
    <Provider store={store}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: "#4CAF50",
          tabBarInactiveTintColor: "#9E9E9E",
          tabBarStyle: {
            backgroundColor: "#FFFFFF",
            borderTopWidth: 0,
            height: Platform.OS === "ios" ? 88 : 64,
            paddingBottom: Platform.OS === "ios" ? 28 : 8,
            paddingTop: 8,
            ...Platform.select({
              ios: {
                shadowColor: "#000",
                shadowOffset: { width: 0, height: -2 },
                shadowOpacity: 0.1,
                shadowRadius: 12,
              },
              android: {
                elevation: 8,
              },
            }),
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: "600",
            marginTop: 4,
          },
          tabBarIconStyle: {
            marginTop: 4,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Dashboard",
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? "home" : "home-outline"}
                size={24}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="planner"
          options={{
            title: "Planner",
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? "calendar" : "calendar-outline"}
                size={24}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="analytics"
          options={{
            title: "Analytics",
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? "stats-chart" : "stats-chart-outline"}
                size={24}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: "Settings",
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? "settings" : "settings-outline"}
                size={24}
                color={color}
              />
            ),
          }}
        />
      </Tabs>
    </Provider>
  );
}
