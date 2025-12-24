// Root Navigator - Auth gating logic
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { View, ActivityIndicator, Text } from "react-native";
import AuthStack from "./AuthStack";
import AppTabs from "./AppTabs";
import CreateFriendScreen from "../screens/auth/CreateFriendScreen";
import { useAuth } from "../context/AuthContext";
import { useUser } from "../context/UserContext";

const LoadingScreen: React.FC = () => (
  <View className="flex-1 items-center justify-center bg-background-light">
    <View className="bg-white p-8 rounded-3xl shadow-kawaii">
      <ActivityIndicator size="large" color="#FF7F95" />
      <Text className="text-primary-600 mt-4 text-base font-medium">
        Yükleniyor...
      </Text>
    </View>
  </View>
);

const RootNavigator: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const { hasFriend, loading: userLoading } = useUser();

  // Show loading while checking auth and user state
  if (authLoading || (user && userLoading)) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      {!user ? (
        // Not logged in -> show auth screens
        <AuthStack />
      ) : !hasFriend ? (
        // Logged in but no friend created -> show create friend screen
        <CreateFriendScreen />
      ) : (
        // Logged in and has friend -> show main app
        <AppTabs />
      )}
    </NavigationContainer>
  );
};

export default RootNavigator;
