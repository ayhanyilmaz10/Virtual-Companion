// Auth Stack Navigator
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/auth/LoginScreen";
import RegisterScreen from "../screens/auth/RegisterScreen";
import CreateFriendScreen from "../screens/auth/CreateFriendScreen";

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  CreateFriend: undefined;
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

const AuthStack: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: "#FFF5F8" },
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="CreateFriend" component={CreateFriendScreen} />
    </Stack.Navigator>
  );
};

export default AuthStack;
