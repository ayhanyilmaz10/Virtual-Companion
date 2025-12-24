// Create Friend Screen
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useUser } from "../../context/UserContext";

// Avatar options - Only Turtle now!
const AVATARS = [
  { id: "turtle", emoji: "🐢", color: "bg-mint-200", name: "Kaplumbağa" },
];

const CreateFriendScreen: React.FC = () => {
  const { createFriend, loading } = useUser();
  
  const [friendName, setFriendName] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState<string>("turtle"); // Auto-selected
  const [error, setError] = useState("");

  const handleCreate = async () => {
    setError("");

    if (!friendName.trim()) {
      setError("Arkadaşına bir isim ver! 💕");
      return;
    }

    try {
      await createFriend(friendName.trim(), selectedAvatar);
    } catch (e) {
      setError("Bir hata oluştu. Tekrar dene!");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background-light">
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-1 px-6 py-8">
          {/* Header */}
          <View className="items-center mb-8">
            <Text className="text-5xl mb-4">🌟</Text>
            <Text className="text-2xl font-bold text-primary-600 text-center">
              Yeni Arkadaşını Oluştur!
            </Text>
            <Text className="text-base text-lavender-500 mt-2 text-center">
              Ona bir isim ver ve görünüşünü seç
            </Text>
          </View>

          {/* Error Message */}
          {error && (
            <View className="bg-peach-100 border border-peach-300 rounded-2xl p-4 mb-4">
              <Text className="text-peach-700 text-center">{error}</Text>
            </View>
          )}

          {/* Name Input Card */}
          <View className="bg-white rounded-3xl p-6 shadow-soft mb-6">
            <Text className="text-primary-600 font-bold text-lg mb-4">
              İsim 📝
            </Text>
            <TextInput
              className="bg-primary-50 rounded-2xl px-4 py-4 text-base text-primary-800 border border-primary-100"
              placeholder="Arkadaşının ismi nedir?"
              placeholderTextColor="#FFB6C1"
              value={friendName}
              onChangeText={(text) => {
                setFriendName(text);
                setError("");
              }}
              maxLength={20}
            />
            <Text className="text-primary-300 text-right mt-2 mr-2">
              {friendName.length}/20
            </Text>
          </View>

          {/* Avatar Selection Card */}
          <View className="bg-white rounded-3xl p-6 shadow-soft mb-6">
            <Text className="text-primary-600 font-bold text-lg mb-4">
              Avatar Seç 🎨
            </Text>
            <View className="flex-row flex-wrap justify-center">
              {AVATARS.map((avatar) => (
                <View key={avatar.id} className="m-2 items-center">
                  <View
                    className={`w-32 h-32 rounded-3xl items-center justify-center ${avatar.color} border-4 border-primary-500`}
                  >
                    <Image 
                      source={require("../../../assets/turtle/default.png")}
                      className="w-28 h-28"
                      resizeMode="contain"
                    />
                  </View>
                  <Text className="mt-2 text-sm font-medium text-primary-600">
                    {avatar.name}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* Preview */}
          {friendName && (
            <View className="bg-white rounded-3xl p-6 shadow-soft mb-6 items-center">
              <Text className="text-lavender-400 text-sm mb-3">Önizleme</Text>
              <View className="w-40 h-40 rounded-3xl items-center justify-center bg-mint-100 p-2">
                <Image 
                  source={require("../../../assets/turtle/default.png")}
                  className="w-32 h-32"
                  resizeMode="contain"
                />
              </View>
              <Text className="text-primary-600 font-bold text-xl mt-3">
                {friendName}
              </Text>
              <Text className="text-mint-500 text-sm mt-1">😊 Hazır!</Text>
            </View>
          )}

          {/* Create Button */}
          <TouchableOpacity
            className={`rounded-2xl py-4 items-center ${
              loading || !friendName || !selectedAvatar
                ? "bg-mint-200"
                : "bg-mint-500"
            }`}
            onPress={handleCreate}
            disabled={loading || !friendName || !selectedAvatar}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text className="text-white font-bold text-lg">
                Arkadaşımı Oluştur! 🎉
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CreateFriendScreen;
