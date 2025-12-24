// History Screen
import React from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useUser } from "../../context/UserContext";
import { InteractionEvent } from "../../services/userService";
import { formatDate, formatRelativeTime } from "../../utils/dates";
import {
  getInteractionEmoji,
  getInteractionLabel,
  getStateEmoji,
  getStateLabel,
} from "../../utils/stateMachine";

// Button Assets Mapping for History
const BUTTON_IMAGES: Record<string, any> = {
  feed: require("../../../assets/buttons/feed_btn.png"),
  play: require("../../../assets/buttons/play_btn.png"),
  rest: require("../../../assets/buttons/sleep_btn.png"),
};

// Interaction Card Component
interface InteractionCardProps {
  interaction: InteractionEvent;
}

const InteractionCard: React.FC<InteractionCardProps> = ({ interaction }) => {
  return (
    <View className="bg-white rounded-2xl p-4 mb-3 shadow-soft flex-row items-center">
      {/* Interaction Icon */}
      <View className="w-16 h-16 rounded-2xl bg-primary-50 items-center justify-center mr-4">
        <Image 
          source={BUTTON_IMAGES[interaction.type]}
          className="w-12 h-12"
          resizeMode="contain"
        />
      </View>

      {/* Content */}
      <View className="flex-1">
        <Text className="text-primary-600 font-bold text-base">
          {getInteractionLabel(interaction.type)}
        </Text>

        {/* State Transition */}
        <View className="flex-row items-center mt-1">
          <Text className="text-sm">
            {getStateEmoji(interaction.prevState)}{" "}
            {getStateLabel(interaction.prevState)}
          </Text>
          <Text className="text-lavender-400 mx-2">→</Text>
          <Text className="text-sm">
            {getStateEmoji(interaction.nextState)}{" "}
            {getStateLabel(interaction.nextState)}
          </Text>
        </View>

        {/* Timestamp */}
        <Text className="text-lavender-400 text-xs mt-1">
          {formatRelativeTime(interaction.createdAt)}
        </Text>
      </View>
    </View>
  );
};

// Empty State Component
const EmptyState: React.FC = () => (
  <View className="flex-1 items-center justify-center py-20">
    <Text className="text-6xl mb-4">📜</Text>
    <Text className="text-primary-500 font-bold text-lg">
      Henüz geçmiş yok
    </Text>
    <Text className="text-lavender-400 text-center mt-2 px-8">
      Arkadaşınla etkileşime geçtiğinde burada görünecek!
    </Text>
  </View>
);

const HistoryScreen: React.FC = () => {
  const { interactions, loading, friendName } = useUser();

  return (
    <SafeAreaView className="flex-1 bg-background-light">
      <View className="flex-1 px-6 pt-4">
        {/* Header */}
        <View className="mb-6">
          <Text className="text-2xl font-bold text-primary-600">
            Geçmiş 📜
          </Text>
          <Text className="text-lavender-400 mt-1">
            {friendName} ile anıların
          </Text>
        </View>

        {loading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#FF7F95" />
          </View>
        ) : interactions.length === 0 ? (
          <EmptyState />
        ) : (
          <FlatList
            data={interactions}
            keyExtractor={(item, index) => `interaction-${index}`}
            renderItem={({ item }) => <InteractionCard interaction={item} />}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        )}

        {/* Stats Card */}
        {interactions.length > 0 && (
          <View className="bg-white rounded-3xl p-5 mb-4 shadow-soft">
            <Text className="text-primary-600 font-bold mb-3">
              📊 İstatistikler
            </Text>
            <View className="flex-row justify-around">
              <View className="items-center">
                <Text className="text-2xl font-bold text-primary-500">
                  {interactions.filter((i) => i.type === "feed").length}
                </Text>
                <Text className="text-lavender-400 text-sm">🍎 Besle</Text>
              </View>
              <View className="items-center">
                <Text className="text-2xl font-bold text-lavender-500">
                  {interactions.filter((i) => i.type === "play").length}
                </Text>
                <Text className="text-lavender-400 text-sm">🎮 Oyna</Text>
              </View>
              <View className="items-center">
                <Text className="text-2xl font-bold text-mint-500">
                  {interactions.filter((i) => i.type === "rest").length}
                </Text>
                <Text className="text-lavender-400 text-sm">💤 Dinlen</Text>
              </View>
            </View>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default HistoryScreen;
