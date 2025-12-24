// User/Firestore Service
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  onSnapshot,
  collection,
  addDoc,
  query,
  orderBy,
  limit,
  Timestamp,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";

// Types
export type FriendState = "hungry" | "tired" | "happy" | "bored";
export type InteractionType = "feed" | "play" | "rest";

export interface UserDocument {
  email: string;
  friendName: string;
  friendAvatar: string;
  friendState: FriendState;
  lastInteraction: Timestamp | null;
  notificationEnabled: boolean;
  level?: number;
  happinessScore?: number;
  createdAt: Timestamp;
}

export interface InteractionEvent {
  type: InteractionType;
  prevState: FriendState;
  nextState: FriendState;
  createdAt: Timestamp;
}

/**
 * Get user document by UID
 */
export const getUserDoc = async (uid: string): Promise<UserDocument | null> => {
  const docRef = doc(db, "users", uid);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    return docSnap.data() as UserDocument;
  }
  return null;
};

/**
 * Create a new user document
 */
export const createUserDoc = async (
  uid: string,
  email: string
): Promise<void> => {
  const docRef = doc(db, "users", uid);
  await setDoc(docRef, {
    email,
    friendName: "",
    friendAvatar: "",
    friendState: "happy",
    lastInteraction: null,
    notificationEnabled: true,
    level: 1,
    happinessScore: 100,
    createdAt: serverTimestamp(),
  });
};

/**
 * Update friend profile (name, avatar)
 */
export const updateFriendProfile = async (
  uid: string,
  friendName: string,
  friendAvatar: string
): Promise<void> => {
  const { setDoc } = await import("firebase/firestore");
  const docRef = doc(db, "users", uid);
  await setDoc(docRef, {
    friendName,
    friendAvatar,
    friendState: "happy",
    lastInteraction: serverTimestamp(),
  }, { merge: true });
};

/**
 * Update friend state
 */
export const updateFriendState = async (
  uid: string,
  newState: FriendState
): Promise<void> => {
  const docRef = doc(db, "users", uid);
  await updateDoc(docRef, {
    friendState: newState,
    lastInteraction: serverTimestamp(),
  });
};

/**
 * Update notification preference
 */
export const updateNotificationEnabled = async (
  uid: string,
  enabled: boolean
): Promise<void> => {
  const docRef = doc(db, "users", uid);
  await updateDoc(docRef, {
    notificationEnabled: enabled,
  });
};

/**
 * Add an interaction event to history
 */
export const addInteraction = async (
  uid: string,
  type: InteractionType,
  prevState: FriendState,
  nextState: FriendState
): Promise<void> => {
  const interactionsRef = collection(db, "users", uid, "interactions");
  await addDoc(interactionsRef, {
    type,
    prevState,
    nextState,
    createdAt: serverTimestamp(),
  });
};

/**
 * Get recent interactions
 */
export const getRecentInteractions = async (
  uid: string,
  count: number = 20
): Promise<InteractionEvent[]> => {
  const interactionsRef = collection(db, "users", uid, "interactions");
  const q = query(interactionsRef, orderBy("createdAt", "desc"), limit(count));
  
  const { getDocs } = await import("firebase/firestore");
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map((doc) => doc.data() as InteractionEvent);
};

/**
 * Subscribe to user document changes (real-time sync)
 */
export const subscribeToUser = (
  uid: string,
  callback: (user: UserDocument | null) => void
): (() => void) => {
  const docRef = doc(db, "users", uid);
  
  return onSnapshot(docRef, (docSnap) => {
    if (docSnap.exists()) {
      callback(docSnap.data() as UserDocument);
    } else {
      callback(null);
    }
  });
};

/**
 * Subscribe to interactions (real-time sync)
 */
export const subscribeToInteractions = (
  uid: string,
  callback: (interactions: InteractionEvent[]) => void,
  count: number = 20
): (() => void) => {
  const interactionsRef = collection(db, "users", uid, "interactions");
  const q = query(interactionsRef, orderBy("createdAt", "desc"), limit(count));
  
  return onSnapshot(q, (snapshot) => {
    const interactions = snapshot.docs.map((doc) => doc.data() as InteractionEvent);
    callback(interactions);
  });
};

/**
 * Reset friend (clear friend data)
 */
export const resetFriend = async (uid: string): Promise<void> => {
  const docRef = doc(db, "users", uid);
  await updateDoc(docRef, {
    friendName: "",
    friendAvatar: "",
    friendState: "happy",
    lastInteraction: null,
    level: 1,
    happinessScore: 100,
  });
};
