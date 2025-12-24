// Home Screen - My Friend
import React, { useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  ScrollView,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useUser } from "../../context/UserContext";
import { formatRelativeTime } from "../../utils/dates";
import {
  getStateEmoji,
  getStateLabel,
  getStateColor,
} from "../../utils/stateMachine";

// Avatar mapping - Default Fallbacks
const AVATARS: Record<string, { emoji: string; color: string }> = {
  turtle: { emoji: "🐢", color: "bg-mint-200" },
};

// Turtle State Assets Mapping
const TURTLE_IMAGES: Record<string, any> = {
  happy: require("../../../assets/turtle/default.png"),
  hungry: require("../../../assets/turtle/needy.png"),
  bored: require("../../../assets/turtle/default2.png"),
  tired: require("../../../assets/turtle/sleepy.png"),
  default: require("../../../assets/turtle/default.png"),
};

// Interaction Button Assets Mapping
const BUTTON_IMAGES: Record<string, any> = {
  feed: require("../../../assets/buttons/feed_btn.png"),
  play: require("../../../assets/buttons/play_btn.png"),
  rest: require("../../../assets/buttons/sleep_btn.png"),
};

// Interaction Button Component
interface InteractionButtonProps {
  type: "feed" | "play" | "rest";
  label: string;
  onPress: () => void;
  disabled?: boolean;
}

const InteractionButton: React.FC<InteractionButtonProps> = ({
  type,
  label,
  onPress,
  disabled,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.9,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      tension: 150,
      useNativeDriver: true,
    }).start();
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      activeOpacity={0.8}
    >
      <Animated.View
        style={{ transform: [{ scale: scaleAnim }] }}
        className="items-center justify-center"
      >
        <Image 
          source={BUTTON_IMAGES[type]} 
          className="w-24 h-24"
          resizeMode="contain"
        />
        <Text className="text-lavender-500 font-bold text-xs mt-1">{label}</Text>
      </Animated.View>
    </TouchableOpacity>
  );
};

const HomeScreen: React.FC = () => {
  const {
    friendName,
    friendAvatar,
    friendState,
    lastInteraction,
    performInteraction,
    loading,
  } = useUser();

  // Animation for character
  const bounceAnim = useRef(new Animated.Value(0)).current;

  const playBounceAnimation = () => {
    Animated.sequence([
      Animated.timing(bounceAnim, {
        toValue: -20,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(bounceAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(bounceAnim, {
        toValue: -10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(bounceAnim, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleInteraction = async (type: "feed" | "play" | "rest") => {
    playBounceAnimation();
    await performInteraction(type);
  };

  const avatar = AVATARS[friendAvatar] || AVATARS.turtle;

  return (
    <SafeAreaView className="flex-1 bg-background-light">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 px-6 py-4">
          {/* Header */}
          <View className="items-center mb-2">
            <Text className="text-lg text-lavender-400 font-medium">
              Bugün nasılsın?
            </Text>
          </View>

          {/* Character Display */}
          <View className="items-center my-6">
            <Animated.View
              style={{ transform: [{ translateY: bounceAnim }] }}
              className={`w-48 h-48 rounded-full items-center justify-center ${avatar.color} shadow-kawaii overflow-hidden`}
            >
              <Image 
                source={TURTLE_IMAGES[friendState] || TURTLE_IMAGES.default}
                className="w-40 h-40"
                resizeMode="contain"
              />
            </Animated.View>

            {/* Character Name */}
            <Text className="text-3xl font-bold text-primary-600 mt-4">
              {friendName}
            </Text>

            {/* State Badge */}
            <View
              className={`mt-3 px-6 py-2 rounded-full ${getStateColor(
                friendState
              )} flex-row items-center`}
            >
              <Text className="text-2xl mr-2">
                {getStateEmoji(friendState)}
              </Text>
              <Text className="text-primary-700 font-bold text-lg">
                {getStateLabel(friendState)}
              </Text>
            </View>

            {/* Last Interaction */}
            <Text className="text-lavender-400 mt-3 text-sm">
              Son etkileşim: {formatRelativeTime(lastInteraction)}
            </Text>
          </View>

          {/* Divider */}
          <View className="h-px bg-primary-100 my-4" />

          {/* Interaction Buttons */}
          <View className="items-center">
            <Text className="text-primary-500 font-bold text-lg mb-4">
              Ne yapmak istersin? 💭
            </Text>

            <View className="flex-row justify-center gap-4">
              <InteractionButton
                type="feed"
                label="Besle"
                onPress={() => handleInteraction("feed")}
                disabled={loading}
              />
              <InteractionButton
                type="play"
                label="Oyna"
                onPress={() => handleInteraction("play")}
                disabled={loading}
              />
              <InteractionButton
                type="rest"
                label="Dinlendir"
                onPress={() => handleInteraction("rest")}
                disabled={loading}
              />
            </View>
          </View>

          {/* Tips Card */}
          <View className="bg-white rounded-3xl p-5 mt-8 shadow-soft">
            <Text className="text-primary-600 font-bold mb-2">💡 İpucu</Text>
            <Text className="text-lavender-500 text-sm leading-5">
              {friendState === "hungry" &&
                "Arkadaşın aç görünüyor! Onu beslemek mutlu edecektir."}
              {friendState === "tired" &&
                "Yorgun görünüyor... Biraz dinlenmesine izin ver."}
              {friendState === "bored" &&
                "Sıkılmış gibi görünüyor. Onunla oynamaya ne dersin?"}
              {friendState === "happy" &&
                "Arkadaşın çok mutlu! Böyle devam et! 🌟"}
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;
