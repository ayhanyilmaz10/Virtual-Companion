// Authentication Service
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged as firebaseOnAuthStateChanged,
  User,
} from "firebase/auth";
import { auth } from "./firebase";

export interface AuthError {
  code: string;
  message: string;
}

/**
 * Sign up a new user with email and password
 */
export const signUp = async (
  email: string,
  password: string
): Promise<User> => {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );
  return userCredential.user;
};

/**
 * Sign in an existing user with email and password
 */
export const signIn = async (
  email: string,
  password: string
): Promise<User> => {
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );
  return userCredential.user;
};

/**
 * Sign out the current user
 */
export const signOut = async (): Promise<void> => {
  await firebaseSignOut(auth);
};

/**
 * Subscribe to auth state changes
 */
export const onAuthStateChanged = (
  callback: (user: User | null) => void
): (() => void) => {
  return firebaseOnAuthStateChanged(auth, callback);
};

/**
 * Get user-friendly error message from Firebase auth error codes
 */
export const getAuthErrorMessage = (errorCode: string): string => {
  switch (errorCode) {
    case "auth/email-already-in-use":
      return "Bu e-posta adresi zaten kullanılıyor.";
    case "auth/invalid-email":
      return "Geçersiz e-posta adresi.";
    case "auth/operation-not-allowed":
      return "Bu işlem şu anda kullanılamıyor.";
    case "auth/weak-password":
      return "Şifre çok zayıf. En az 6 karakter kullanın.";
    case "auth/user-disabled":
      return "Bu hesap devre dışı bırakılmış.";
    case "auth/user-not-found":
      return "Bu e-posta adresiyle kayıtlı kullanıcı bulunamadı.";
    case "auth/wrong-password":
      return "Hatalı şifre.";
    case "auth/invalid-credential":
      return "Giriş bilgileri geçersiz.";
    case "auth/too-many-requests":
      return "Çok fazla başarısız deneme. Lütfen daha sonra tekrar deneyin.";
    default:
      return "Bir hata oluştu. Lütfen tekrar deneyin.";
  }
};
