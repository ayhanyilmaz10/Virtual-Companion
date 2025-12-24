// State Machine - Friend State Transitions
import { FriendState, InteractionType } from "../services/userService";

/**
 * State transition rules:
 * 
 * Feed:  hungry→happy, bored→happy, tired→bored, happy→happy
 * Play:  bored→happy, hungry→bored, tired→tired, happy→happy
 * Rest:  tired→happy, hungry→tired, bored→tired, happy→happy
 */

type TransitionMap = Record<FriendState, FriendState>;

const TRANSITIONS: Record<InteractionType, TransitionMap> = {
  feed: {
    hungry: "happy",
    bored: "happy",
    tired: "bored",
    happy: "happy",
  },
  play: {
    bored: "happy",
    hungry: "bored",
    tired: "tired",
    happy: "happy",
  },
  rest: {
    tired: "happy",
    hungry: "tired",
    bored: "tired",
    happy: "happy",
  },
};

/**
 * Get the next state after performing an interaction
 */
export const getNextState = (
  currentState: FriendState,
  interaction: InteractionType
): FriendState => {
  return TRANSITIONS[interaction][currentState];
};

/**
 * Get emoji for a friend state
 */
export const getStateEmoji = (state: FriendState): string => {
  switch (state) {
    case "hungry":
      return "🍽️";
    case "tired":
      return "😴";
    case "happy":
      return "😊";
    case "bored":
      return "😐";
    default:
      return "❓";
  }
};

/**
 * Get Turkish label for a friend state
 */
export const getStateLabel = (state: FriendState): string => {
  switch (state) {
    case "hungry":
      return "Aç";
    case "tired":
      return "Yorgun";
    case "happy":
      return "Mutlu";
    case "bored":
      return "Sıkılmış";
    default:
      return "Bilinmiyor";
  }
};

/**
 * Get color for a friend state (NativeWind compatible)
 */
export const getStateColor = (state: FriendState): string => {
  switch (state) {
    case "hungry":
      return "bg-peach-200";
    case "tired":
      return "bg-lavender-200";
    case "happy":
      return "bg-mint-200";
    case "bored":
      return "bg-cream-200";
    default:
      return "bg-primary-200";
  }
};

/**
 * Get interaction emoji
 */
export const getInteractionEmoji = (type: InteractionType): string => {
  switch (type) {
    case "feed":
      return "🍎";
    case "play":
      return "🎮";
    case "rest":
      return "💤";
    default:
      return "❓";
  }
};

/**
 * Get Turkish label for an interaction type
 */
export const getInteractionLabel = (type: InteractionType): string => {
  switch (type) {
    case "feed":
      return "Besle";
    case "play":
      return "Oyna";
    case "rest":
      return "Dinlendir";
    default:
      return "Bilinmiyor";
  }
};
