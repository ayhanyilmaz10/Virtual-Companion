// Login Screen
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { AuthStackParamList } from "../../navigation/AuthStack";
import { useAuth } from "../../context/AuthContext";

type LoginScreenNavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  "Login"
>;

const LoginScreen: React.FC = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const { login, loading, error, clearError } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) return;

    try {
      await login(email.trim(), password);
    } catch (e) {
      // Error is handled by context
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background-light">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="flex-1 px-6 justify-center">
            {/* Logo/Header Area */}
            <View className="items-center mb-10">
              <Text className="text-6xl mb-4">🐰</Text>
              <Text className="text-3xl font-bold text-primary-600">
                Merhaba!
              </Text>
              <Text className="text-base text-lavender-500 mt-2">
                Arkadaşın seni bekliyor
              </Text>
            </View>

            {/* Form Card */}
            <View className="bg-white rounded-3xl p-6 shadow-soft">
              {/* Error Message */}
              {error && (
                <View className="bg-peach-100 border border-peach-300 rounded-2xl p-4 mb-4">
                  <Text className="text-peach-700 text-center">{error}</Text>
                </View>
              )}

              {/* Email Input */}
              <View className="mb-4">
                <Text className="text-primary-600 font-medium mb-2 ml-1">
                  E-posta
                </Text>
                <TextInput
                  className="bg-primary-50 rounded-2xl px-4 py-4 text-base text-primary-800 border border-primary-100"
                  placeholder="ornek@email.com"
                  placeholderTextColor="#FFB6C1"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    clearError();
                  }}
                />
              </View>

              {/* Password Input */}
              <View className="mb-6">
                <Text className="text-primary-600 font-medium mb-2 ml-1">
                  Şifre
                </Text>
                <TextInput
                  className="bg-primary-50 rounded-2xl px-4 py-4 text-base text-primary-800 border border-primary-100"
                  placeholder="••••••••"
                  placeholderTextColor="#FFB6C1"
                  secureTextEntry
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    clearError();
                  }}
                />
              </View>

              {/* Login Button */}
              <TouchableOpacity
                className={`rounded-2xl py-4 items-center ${
                  loading || !email || !password
                    ? "bg-primary-200"
                    : "bg-primary-500"
                }`}
                onPress={handleLogin}
                disabled={loading || !email || !password}
                activeOpacity={0.8}
              >
                {loading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text className="text-white font-bold text-lg">
                    Giriş Yap 💕
                  </Text>
                )}
              </TouchableOpacity>
            </View>

            {/* Register Link */}
            <View className="flex-row justify-center mt-6">
              <Text className="text-lavender-500">Hesabın yok mu? </Text>
              <TouchableOpacity onPress={() => navigation.navigate("Register")}>
                <Text className="text-primary-500 font-bold">Kayıt ol</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;
