// Settings Screen
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Switch,
  Modal,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../context/AuthContext";
import { useUser } from "../../context/UserContext";
import { useNotifications } from "../../context/NotificationContext";
import { scheduleTestNotification } from "../../services/notificationService";

// Setting Item Component
interface SettingItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  rightElement?: React.ReactNode;
}

const SettingItem: React.FC<SettingItemProps> = ({
  icon,
  iconColor,
  title,
  subtitle,
  onPress,
  rightElement,
}) => (
  <TouchableOpacity
    className="bg-white rounded-2xl p-4 mb-3 flex-row items-center shadow-soft"
    onPress={onPress}
    disabled={!onPress && !rightElement}
    activeOpacity={onPress ? 0.7 : 1}
  >
    <View
      className="w-12 h-12 rounded-xl items-center justify-center mr-4"
      style={{ backgroundColor: iconColor + "20" }}
    >
      <Ionicons name={icon} size={24} color={iconColor} />
    </View>
    <View className="flex-1">
      <Text className="text-primary-700 font-bold text-base">{title}</Text>
      {subtitle && (
        <Text className="text-lavender-400 text-sm mt-0.5">{subtitle}</Text>
      )}
    </View>
    {rightElement}
    {onPress && !rightElement && (
      <Ionicons name="chevron-forward" size={20} color="#C084FC" />
    )}
  </TouchableOpacity>
);

const SettingsScreen: React.FC = () => {
  const { logout, user } = useAuth();
  const {
    friendName,
    friendState,
    notificationEnabled,
    toggleNotifications,
    resetCompanion,
  } = useUser();
  const { permissionGranted, requestNotificationPermissions } =
    useNotifications();

  const [resetModalVisible, setResetModalVisible] = useState(false);

  // Handle notification toggle
  const handleNotificationToggle = async (value: boolean) => {
    if (value && !permissionGranted) {
      const granted = await requestNotificationPermissions();
      if (!granted) {
        Alert.alert(
          "İzin Gerekli",
          "Bildirimleri açmak için uygulama ayarlarından izin vermeniz gerekiyor.",
          [{ text: "Tamam" }]
        );
        return;
      }
    }
    await toggleNotifications(value);
  };

  // Handle test notification
  const handleTestNotification = async () => {
    if (!permissionGranted) {
      Alert.alert(
        "Bildirim İzni Yok",
        "Önce bildirimleri etkinleştirin.",
        [{ text: "Tamam" }]
      );
      return;
    }

    await scheduleTestNotification(friendState);
    Alert.alert(
      "Test Bildirimi",
      "5 saniye sonra bir test bildirimi alacaksınız! 🔔",
      [{ text: "Harika!" }]
    );
  };

  // Handle reset friend
  const handleResetFriend = async () => {
    setResetModalVisible(false);
    await resetCompanion();
  };

  // Handle logout
  const handleLogout = () => {
    Alert.alert(
      "Çıkış Yap",
      "Çıkış yapmak istediğinize emin misiniz?",
      [
        { text: "İptal", style: "cancel" },
        { text: "Çıkış Yap", style: "destructive", onPress: logout },
      ]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-background-light">
      <View className="flex-1 px-6 pt-4">
        {/* Header */}
        <View className="mb-6">
          <Text className="text-2xl font-bold text-primary-600">
            Ayarlar ⚙️
          </Text>
          <Text className="text-lavender-400 mt-1">{user?.email}</Text>
        </View>

        {/* Profile Section */}
        <Text className="text-lavender-400 font-bold text-sm mb-3 ml-1">
          PROFİL
        </Text>
        <SettingItem
          icon="person"
          iconColor="#FF7F95"
          title={friendName}
          subtitle="Arkadaşının adı"
        />

        {/* Notifications Section */}
        <Text className="text-lavender-400 font-bold text-sm mb-3 ml-1 mt-4">
          BİLDİRİMLER
        </Text>
        <SettingItem
          icon="notifications"
          iconColor="#A855F7"
          title="Bildirimler"
          subtitle={notificationEnabled ? "Açık" : "Kapalı"}
          rightElement={
            <Switch
              value={notificationEnabled}
              onValueChange={handleNotificationToggle}
              trackColor={{ false: "#FFE4EC", true: "#D8B4FE" }}
              thumbColor={notificationEnabled ? "#A855F7" : "#FFB6C1"}
            />
          }
        />
        <SettingItem
          icon="notifications-outline"
          iconColor="#14B8A6"
          title="Test Bildirimi"
          subtitle="5 saniye sonra bildirim alın"
          onPress={handleTestNotification}
        />

        {/* Actions Section */}
        <Text className="text-lavender-400 font-bold text-sm mb-3 ml-1 mt-4">
          İŞLEMLER
        </Text>
        <SettingItem
          icon="refresh"
          iconColor="#F97316"
          title="Arkadaşı Sıfırla"
          subtitle="Yeni bir arkadaş oluştur"
          onPress={() => setResetModalVisible(true)}
        />
        <SettingItem
          icon="log-out"
          iconColor="#EF4444"
          title="Çıkış Yap"
          subtitle="Hesabından çıkış yap"
          onPress={handleLogout}
        />

        {/* App Info */}
        <View className="items-center mt-auto mb-6">
          <Text className="text-lavender-300 text-sm">
            Virtual Companion v1.0.0
          </Text>
          <Text className="text-lavender-200 text-xs mt-1">
            Made with 💕
          </Text>
        </View>
      </View>

      {/* Reset Modal */}
      <Modal
        visible={resetModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setResetModalVisible(false)}
      >
        <View className="flex-1 bg-black/50 items-center justify-center px-6">
          <View className="bg-white rounded-3xl p-6 w-full max-w-sm">
            <Text className="text-5xl text-center mb-4">🥺</Text>
            <Text className="text-primary-600 font-bold text-xl text-center">
              Emin misin?
            </Text>
            <Text className="text-lavender-500 text-center mt-2">
              {friendName} ile tüm anılarını kaybedeceksin. Bu işlem geri
              alınamaz.
            </Text>

            <View className="flex-row gap-3 mt-6">
              <TouchableOpacity
                className="flex-1 bg-lavender-100 rounded-2xl py-3"
                onPress={() => setResetModalVisible(false)}
              >
                <Text className="text-lavender-600 font-bold text-center">
                  İptal
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-1 bg-peach-500 rounded-2xl py-3"
                onPress={handleResetFriend}
              >
                <Text className="text-white font-bold text-center">
                  Sıfırla
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default SettingsScreen;
