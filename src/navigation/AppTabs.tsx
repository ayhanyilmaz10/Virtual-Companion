// App Bottom Tab Navigator
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import HomeScreen from "../screens/home/HomeScreen";
import HistoryScreen from "../screens/communityOrHistory/HistoryScreen";
import SettingsScreen from "../screens/settings/SettingsScreen";

export type AppTabParamList = {
  Home: undefined;
  History: undefined;
  Settings: undefined;
};

const Tab = createBottomTabNavigator<AppTabParamList>();

const AppTabs: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          borderTopColor: "#FFE4EC",
          borderTopWidth: 1,
          height: 80,
          paddingBottom: 20,
          paddingTop: 10,
          shadowColor: "#FF7F95",
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.1,
          shadowRadius: 12,
          elevation: 10,
        },
        tabBarActiveTintColor: "#FF7F95",
        tabBarInactiveTintColor: "#C084FC",
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = "home";

          switch (route.name) {
            case "Home":
              iconName = focused ? "heart" : "heart-outline";
              break;
            case "History":
              iconName = focused ? "time" : "time-outline";
              break;
            case "Settings":
              iconName = focused ? "settings" : "settings-outline";
              break;
          }

          return (
            <Ionicons
              name={iconName}
              size={focused ? 28 : 24}
              color={color}
            />
          );
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ tabBarLabel: "Arkadaşım" }}
      />
      <Tab.Screen
        name="History"
        component={HistoryScreen}
        options={{ tabBarLabel: "Geçmiş" }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ tabBarLabel: "Ayarlar" }}
      />
    </Tab.Navigator>
  );
};

export default AppTabs;
