// Notification Service
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Platform } from "react-native";
import { FriendState } from "./userService";

// Notification content based on friend state
const NOTIFICATION_CONTENT: Record<
  FriendState,
  { title: string; body: string; delay: number }
> = {
  hungry: {
    title: "🍎 Beslenme Zamanı!",
    body: "Arkadaşının beslenmeye ihtiyacı var!",
    delay: 2 * 60 * 60, // 2 hours in seconds
  },
  bored: {
    title: "🎮 Oyun Zamanı!",
    body: "Arkadaşın seninle oynamak istiyor!",
    delay: 3 * 60 * 60, // 3 hours
  },
  tired: {
    title: "💤 Dinlenme Zamanı!",
    body: "Arkadaşın dinlenmek istiyor...",
    delay: 4 * 60 * 60, // 4 hours
  },
  happy: {
    title: "🥺 Seni Özledim!",
    body: "Arkadaşın seni özledi, gel biraz vakit geçirelim!",
    delay: 6 * 60 * 60, // 6 hours
  },
};

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

/**
 * Request notification permissions
 * Returns true if granted, false otherwise
 */
export const requestPermissions = async (): Promise<boolean> => {
  if (!Device.isDevice) {
    console.log("Notifications require a physical device");
    return false;
  }

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "Virtual Companion",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF7F95",
    });
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  return finalStatus === "granted";
};

/**
 * Get the Expo push token (for future push notification support)
 */
export const getExpoPushToken = async (): Promise<string | null> => {
  try {
    const token = await Notifications.getExpoPushTokenAsync({
      projectId: process.env.EXPO_PUBLIC_PROJECT_ID,
    });
    return token.data;
  } catch (error) {
    console.log("Error getting push token:", error);
    return null;
  }
};

/**
 * Schedule a local notification based on friend state
 */
export const scheduleStateNotification = async (
  state: FriendState
): Promise<string | null> => {
  const content = NOTIFICATION_CONTENT[state];
  
  try {
    const identifier = await Notifications.scheduleNotificationAsync({
      content: {
        title: content.title,
        body: content.body,
        sound: true,
        priority: Notifications.AndroidNotificationPriority.HIGH,
        data: { friendState: state },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: content.delay,
        repeats: false,
      },
    });
    
    console.log(`Scheduled notification for state "${state}" with ID: ${identifier}`);
    return identifier;
  } catch (error) {
    console.log("Error scheduling notification:", error);
    return null;
  }
};

/**
 * Schedule a test notification (fires in 5 seconds for testing)
 */
export const scheduleTestNotification = async (
  state: FriendState
): Promise<string | null> => {
  const content = NOTIFICATION_CONTENT[state];
  
  try {
    const identifier = await Notifications.scheduleNotificationAsync({
      content: {
        title: content.title,
        body: content.body,
        sound: true,
        data: { friendState: state, test: true },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: 5,
        repeats: false,
      },
    });
    
    console.log(`Scheduled TEST notification with ID: ${identifier}`);
    return identifier;
  } catch (error) {
    console.log("Error scheduling test notification:", error);
    return null;
  }
};

/**
 * Cancel all scheduled notifications
 */
export const cancelAllNotifications = async (): Promise<void> => {
  await Notifications.cancelAllScheduledNotificationsAsync();
  console.log("All scheduled notifications cancelled");
};

/**
 * Get all scheduled notifications
 */
export const getScheduledNotifications = async (): Promise<
  Notifications.NotificationRequest[]
> => {
  return await Notifications.getAllScheduledNotificationsAsync();
};

/**
 * Add notification response listener
 */
export const addNotificationResponseListener = (
  callback: (response: Notifications.NotificationResponse) => void
): Notifications.EventSubscription => {
  return Notifications.addNotificationResponseReceivedListener(callback);
};

/**
 * Add notification received listener
 */
export const addNotificationReceivedListener = (
  callback: (notification: Notifications.Notification) => void
): Notifications.EventSubscription => {
  return Notifications.addNotificationReceivedListener(callback);
};
