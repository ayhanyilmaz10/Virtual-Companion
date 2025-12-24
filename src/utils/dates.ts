// Date Utilities
import { Timestamp } from "firebase/firestore";

/**
 * Format a timestamp to relative time in Turkish
 * e.g., "5 dakika önce", "2 saat önce", "dün"
 */
export const formatRelativeTime = (timestamp: Timestamp | null): string => {
  if (!timestamp) return "Henüz etkileşim yok";

  const now = new Date();
  const date = timestamp.toDate();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return "Az önce";
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} dakika önce`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} saat önce`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays === 1) {
    return "Dün";
  }
  if (diffInDays < 7) {
    return `${diffInDays} gün önce`;
  }

  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) {
    return `${diffInWeeks} hafta önce`;
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths} ay önce`;
  }

  const diffInYears = Math.floor(diffInDays / 365);
  return `${diffInYears} yıl önce`;
};

/**
 * Format a timestamp to a readable date string
 * e.g., "24 Aralık 2024, 15:30"
 */
export const formatDate = (timestamp: Timestamp | null): string => {
  if (!timestamp) return "—";

  const date = timestamp.toDate();
  const months = [
    "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
    "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık",
  ];

  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");

  return `${day} ${month} ${year}, ${hours}:${minutes}`;
};

/**
 * Format time only from timestamp
 * e.g., "15:30"
 */
export const formatTime = (timestamp: Timestamp | null): string => {
  if (!timestamp) return "—";

  const date = timestamp.toDate();
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");

  return `${hours}:${minutes}`;
};

/**
 * Check if two timestamps are on the same day
 */
export const isSameDay = (
  timestamp1: Timestamp | null,
  timestamp2: Timestamp | null
): boolean => {
  if (!timestamp1 || !timestamp2) return false;

  const date1 = timestamp1.toDate();
  const date2 = timestamp2.toDate();

  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};
