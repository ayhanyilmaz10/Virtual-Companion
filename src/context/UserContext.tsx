// User Context - Friend State Management
import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import { Timestamp } from "firebase/firestore";
import { useAuth } from "./AuthContext";
import {
  FriendState,
  InteractionType,
  InteractionEvent,
  subscribeToUser,
  subscribeToInteractions,
  updateFriendState,
  updateFriendProfile,
  updateNotificationEnabled,
  addInteraction,
  resetFriend,
} from "../services/userService";
import { getNextState } from "../utils/stateMachine";
import {
  scheduleStateNotification,
  cancelAllNotifications,
} from "../services/notificationService";

// Types
interface UserState {
  friendName: string;
  friendAvatar: string;
  friendState: FriendState;
  lastInteraction: Timestamp | null;
  notificationEnabled: boolean;
  interactions: InteractionEvent[];
  loading: boolean;
  error: string | null;
}

type UserAction =
  | { type: "SET_USER"; payload: Partial<UserState> }
  | { type: "UPDATE_STATE"; payload: FriendState }
  | { type: "SET_INTERACTIONS"; payload: InteractionEvent[] }
  | { type: "ADD_INTERACTION"; payload: InteractionEvent }
  | { type: "TOGGLE_NOTIFICATIONS"; payload: boolean }
  | { type: "RESET" }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string };

interface UserContextType extends UserState {
  hasFriend: boolean;
  performInteraction: (type: InteractionType) => Promise<void>;
  createFriend: (name: string, avatar: string) => Promise<void>;
  toggleNotifications: (enabled: boolean) => Promise<void>;
  resetCompanion: () => Promise<void>;
}

// Initial state
const initialState: UserState = {
  friendName: "",
  friendAvatar: "",
  friendState: "happy",
  lastInteraction: null,
  notificationEnabled: true,
  interactions: [],
  loading: true,
  error: null,
};

// Reducer
const userReducer = (state: UserState, action: UserAction): UserState => {
  switch (action.type) {
    case "SET_USER":
      return { ...state, ...action.payload, loading: false };
    case "UPDATE_STATE":
      return { ...state, friendState: action.payload };
    case "SET_INTERACTIONS":
      return { ...state, interactions: action.payload };
    case "ADD_INTERACTION":
      return {
        ...state,
        interactions: [action.payload, ...state.interactions],
      };
    case "TOGGLE_NOTIFICATIONS":
      return { ...state, notificationEnabled: action.payload };
    case "RESET":
      return { ...initialState, loading: false };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
};

// Context
const UserContext = createContext<UserContextType | null>(null);

// Provider
export const UserProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { user } = useAuth();
  const [state, dispatch] = useReducer(userReducer, initialState);

  // Subscribe to user document
  useEffect(() => {
    if (!user) {
      dispatch({ type: "RESET" });
      return;
    }

    dispatch({ type: "SET_LOADING", payload: true });

    const unsubscribe = subscribeToUser(user.uid, (userData) => {
      if (userData) {
        dispatch({
          type: "SET_USER",
          payload: {
            friendName: userData.friendName,
            friendAvatar: userData.friendAvatar,
            friendState: userData.friendState,
            lastInteraction: userData.lastInteraction,
            notificationEnabled: userData.notificationEnabled,
          },
        });
      } else {
        dispatch({ type: "SET_LOADING", payload: false });
      }
    });

    return () => unsubscribe();
  }, [user]);

  // Subscribe to interactions
  useEffect(() => {
    if (!user) return;

    const unsubscribe = subscribeToInteractions(user.uid, (interactions) => {
      dispatch({ type: "SET_INTERACTIONS", payload: interactions });
    });

    return () => unsubscribe();
  }, [user]);

  // Create friend
  const createFriend = useCallback(
    async (name: string, avatar: string) => {
      if (!user) return;

      try {
        await updateFriendProfile(user.uid, name, avatar);
        
        // Schedule initial notification
        if (state.notificationEnabled) {
          await cancelAllNotifications();
          await scheduleStateNotification("happy");
        }
      } catch (error: any) {
        dispatch({ type: "SET_ERROR", payload: "Arkadaş oluşturulamadı." });
        throw error;
      }
    },
    [user, state.notificationEnabled]
  );

  // Perform interaction
  const performInteraction = useCallback(
    async (type: InteractionType) => {
      if (!user) return;

      const prevState = state.friendState;
      const nextState = getNextState(prevState, type);

      // Optimistic update
      dispatch({ type: "UPDATE_STATE", payload: nextState });

      try {
        // Update Firestore
        await updateFriendState(user.uid, nextState);
        await addInteraction(user.uid, type, prevState, nextState);

        // Reschedule notification
        if (state.notificationEnabled) {
          await cancelAllNotifications();
          await scheduleStateNotification(nextState);
        }
      } catch (error: any) {
        // Revert on error
        dispatch({ type: "UPDATE_STATE", payload: prevState });
        dispatch({ type: "SET_ERROR", payload: "Etkileşim kaydedilemedi." });
      }
    },
    [user, state.friendState, state.notificationEnabled]
  );

  // Toggle notifications
  const toggleNotifications = useCallback(
    async (enabled: boolean) => {
      if (!user) return;

      // Optimistic update
      dispatch({ type: "TOGGLE_NOTIFICATIONS", payload: enabled });

      try {
        await updateNotificationEnabled(user.uid, enabled);

        if (enabled) {
          await scheduleStateNotification(state.friendState);
        } else {
          await cancelAllNotifications();
        }
      } catch (error: any) {
        // Revert on error
        dispatch({ type: "TOGGLE_NOTIFICATIONS", payload: !enabled });
      }
    },
    [user, state.friendState]
  );

  // Reset companion
  const resetCompanion = useCallback(async () => {
    if (!user) return;

    try {
      await resetFriend(user.uid);
      await cancelAllNotifications();
    } catch (error: any) {
      dispatch({ type: "SET_ERROR", payload: "Sıfırlama başarısız oldu." });
    }
  }, [user]);

  // Computed property
  const hasFriend = Boolean(state.friendName && state.friendAvatar);

  return (
    <UserContext.Provider
      value={{
        ...state,
        hasFriend,
        performInteraction,
        createFriend,
        toggleNotifications,
        resetCompanion,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

// Hook
export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
