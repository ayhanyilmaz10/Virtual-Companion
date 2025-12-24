import { registerRootComponent } from "expo";
import React from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AuthProvider } from "./src/context/AuthContext";
import { UserProvider } from "./src/context/UserContext";
import { NotificationProvider } from "./src/context/NotificationContext";
import RootNavigator from "./src/navigation/RootNavigator";

// Import NativeWind styles
import "./global.css";

function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AuthProvider>
          <UserProvider>
            <NotificationProvider>
              <StatusBar style="dark" />
              <RootNavigator />
            </NotificationProvider>
          </UserProvider>
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

registerRootComponent(App);
