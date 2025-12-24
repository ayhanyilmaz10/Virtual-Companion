// Register Screen
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

type RegisterScreenNavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  "Register"
>;

const RegisterScreen: React.FC = () => {
  const navigation = useNavigation<RegisterScreenNavigationProp>();
  const { register, loading, error, clearError } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [localError, setLocalError] = useState("");

  const handleRegister = async () => {
    setLocalError("");

    if (!email.trim() || !password.trim()) {
      setLocalError("Tüm alanları doldurun.");
      return;
    }

    if (password !== confirmPassword) {
      setLocalError("Şifreler eşleşmiyor.");
      return;
    }

    if (password.length < 6) {
      setLocalError("Şifre en az 6 karakter olmalı.");
      return;
    }

    try {
      await register(email.trim(), password);
      // Navigation handled by RootNavigator
    } catch (e) {
      // Error is handled by context
    }
  };

  const displayError = localError || error;

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
            {/* Header Area */}
            <View className="items-center mb-10">
              <Text className="text-6xl mb-4">🌸</Text>
              <Text className="text-3xl font-bold text-primary-600">
                Hoş geldin!
              </Text>
              <Text className="text-base text-lavender-500 mt-2">
                Yeni bir maceraya başlayalım
              </Text>
            </View>

            {/* Form Card */}
            <View className="bg-white rounded-3xl p-6 shadow-soft">
              {/* Error Message */}
              {displayError && (
                <View className="bg-peach-100 border border-peach-300 rounded-2xl p-4 mb-4">
                  <Text className="text-peach-700 text-center">
                    {displayError}
                  </Text>
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
                    setLocalError("");
                    clearError();
                  }}
                />
              </View>

              {/* Password Input */}
              <View className="mb-4">
                <Text className="text-primary-600 font-medium mb-2 ml-1">
                  Şifre
                </Text>
                <TextInput
                  className="bg-primary-50 rounded-2xl px-4 py-4 text-base text-primary-800 border border-primary-100"
                  placeholder="En az 6 karakter"
                  placeholderTextColor="#FFB6C1"
                  secureTextEntry
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    setLocalError("");
                    clearError();
                  }}
                />
              </View>

              {/* Confirm Password Input */}
              <View className="mb-6">
                <Text className="text-primary-600 font-medium mb-2 ml-1">
                  Şifre Tekrar
                </Text>
                <TextInput
                  className="bg-primary-50 rounded-2xl px-4 py-4 text-base text-primary-800 border border-primary-100"
                  placeholder="Şifreyi tekrar girin"
                  placeholderTextColor="#FFB6C1"
                  secureTextEntry
                  value={confirmPassword}
                  onChangeText={(text) => {
                    setConfirmPassword(text);
                    setLocalError("");
                  }}
                />
              </View>

              {/* Register Button */}
              <TouchableOpacity
                className={`rounded-2xl py-4 items-center ${
                  loading || !email || !password || !confirmPassword
                    ? "bg-lavender-200"
                    : "bg-lavender-500"
                }`}
                onPress={handleRegister}
                disabled={loading || !email || !password || !confirmPassword}
                activeOpacity={0.8}
              >
                {loading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text className="text-white font-bold text-lg">
                    Kayıt Ol ✨
                  </Text>
                )}
              </TouchableOpacity>
            </View>

            {/* Login Link */}
            <View className="flex-row justify-center mt-6">
              <Text className="text-lavender-500">Zaten hesabın var mı? </Text>
              <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                <Text className="text-primary-500 font-bold">Giriş yap</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default RegisterScreen;
