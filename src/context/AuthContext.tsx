// Authentication Context
import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  ReactNode,
} from "react";
import { User } from "firebase/auth";
import { onAuthStateChanged, signIn, signUp, signOut } from "../services/authService";
import { createUserDoc, getUserDoc } from "../services/userService";

// Types
interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

type AuthAction =
  | { type: "AUTH_START" }
  | { type: "AUTH_SUCCESS"; payload: User }
  | { type: "AUTH_FAILURE"; payload: string }
  | { type: "AUTH_LOGOUT" }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "CLEAR_ERROR" };

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

// Initial state
const initialState: AuthState = {
  user: null,
  loading: true,
  error: null,
};

// Reducer
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "AUTH_START":
      return { ...state, loading: true, error: null };
    case "AUTH_SUCCESS":
      return { ...state, user: action.payload, loading: false, error: null };
    case "AUTH_FAILURE":
      return { ...state, user: null, loading: false, error: action.payload };
    case "AUTH_LOGOUT":
      return { ...state, user: null, loading: false, error: null };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "CLEAR_ERROR":
      return { ...state, error: null };
    default:
      return state;
  }
};

// Context
const AuthContext = createContext<AuthContextType | null>(null);

// Provider
export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(async (user) => {
      if (user) {
        dispatch({ type: "AUTH_SUCCESS", payload: user });
      } else {
        dispatch({ type: "AUTH_LOGOUT" });
      }
    });

    return () => unsubscribe();
  }, []);

  // Login
  const login = async (email: string, password: string) => {
    try {
      dispatch({ type: "AUTH_START" });
      const user = await signIn(email, password);
      dispatch({ type: "AUTH_SUCCESS", payload: user });
    } catch (error: any) {
      const { getAuthErrorMessage } = await import("../services/authService");
      dispatch({
        type: "AUTH_FAILURE",
        payload: getAuthErrorMessage(error.code),
      });
      throw error;
    }
  };

  // Register
  const register = async (email: string, password: string) => {
    try {
      dispatch({ type: "AUTH_START" });
      const user = await signUp(email, password);
      
      // Create user document in Firestore
      const existingDoc = await getUserDoc(user.uid);
      if (!existingDoc) {
        await createUserDoc(user.uid, email);
      }
      
      dispatch({ type: "AUTH_SUCCESS", payload: user });
    } catch (error: any) {
      const { getAuthErrorMessage } = await import("../services/authService");
      dispatch({
        type: "AUTH_FAILURE",
        payload: getAuthErrorMessage(error.code),
      });
      throw error;
    }
  };

  // Logout
  const logout = async () => {
    try {
      await signOut();
      dispatch({ type: "AUTH_LOGOUT" });
    } catch (error: any) {
      console.error("Logout error:", error);
    }
  };

  // Clear error
  const clearError = () => {
    dispatch({ type: "CLEAR_ERROR" });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        logout,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
