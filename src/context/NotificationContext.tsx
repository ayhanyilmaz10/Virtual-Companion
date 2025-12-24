// Notification Context
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import { AppState, AppStateStatus } from "react-native";
import {
  requestPermissions,
  getScheduledNotifications,
  addNotificationReceivedListener,
  addNotificationResponseListener,
} from "../services/notificationService";
import * as Notifications from "expo-notifications";

// Types
interface NotificationContextType {
  permissionGranted: boolean;
  scheduledCount: number;
  requestNotificationPermissions: () => Promise<boolean>;
  refreshScheduledCount: () => Promise<void>;
}

// Context
const NotificationContext = createContext<NotificationContextType | null>(null);

// Provider
export const NotificationProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [scheduledCount, setScheduledCount] = useState(0);

  // Check permissions on mount
  useEffect(() => {
    checkPermissions();
    refreshScheduledCount();
  }, []);

  // Refresh count when app comes to foreground
  useEffect(() => {
    const subscription = AppState.addEventListener(
      "change",
      (state: AppStateStatus) => {
        if (state === "active") {
          refreshScheduledCount();
        }
      }
    );

    return () => subscription.remove();
  }, []);

  // Listen to notifications
  useEffect(() => {
    const receivedSubscription = addNotificationReceivedListener(
      (notification) => {
        console.log("Notification received:", notification);
      }
    );

    const responseSubscription = addNotificationResponseListener((response) => {
      console.log("Notification response:", response);
      // Handle notification tap here if needed
    });

    return () => {
      receivedSubscription.remove();
      responseSubscription.remove();
    };
  }, []);

  // Check current permissions
  const checkPermissions = async () => {
    const { status } = await Notifications.getPermissionsAsync();
    setPermissionGranted(status === "granted");
  };

  // Request permissions
  const requestNotificationPermissions = useCallback(async () => {
    const granted = await requestPermissions();
    setPermissionGranted(granted);
    return granted;
  }, []);

  // Refresh scheduled notification count
  const refreshScheduledCount = useCallback(async () => {
    const scheduled = await getScheduledNotifications();
    setScheduledCount(scheduled.length);
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        permissionGranted,
        scheduledCount,
        requestNotificationPermissions,
        refreshScheduledCount,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

// Hook
export const useNotifications = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider"
    );
  }
  return context;
};
