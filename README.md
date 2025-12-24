# Virtual Companion (Sanal Bebek) 🐰

A kawaii-themed virtual companion mobile app built with Expo, React Native, TypeScript, NativeWind, and Firebase.

## Features

- 🔐 **Firebase Authentication** - Email/password signup and login
- 🐰 **Virtual Friend** - Create and care for your cute companion
- 🍎 **Interactions** - Feed, Play, and Rest with your friend
- 📊 **State Management** - Friend states: hungry, tired, happy, bored
- 📜 **History** - Track all your interactions
- 🔔 **Notifications** - Local push notifications when your friend needs you
- 🎨 **Kawaii UI** - Pastel theme with smooth animations

## Screenshots

| Login | Home | History | Settings |
|-------|------|---------|----------|
| 📱 | 🏠 | 📜 | ⚙️ |

## Tech Stack

- **Framework**: Expo (managed workflow)
- **Language**: TypeScript
- **Styling**: NativeWind (Tailwind CSS for React Native)
- **Navigation**: React Navigation (Stack + Bottom Tabs)
- **State**: React Context + useReducer
- **Backend**: Firebase (Auth + Firestore)
- **Notifications**: Expo Notifications

## Setup

### 1. Prerequisites

- Node.js 18+
- npm or yarn
- Expo CLI: `npm install -g expo-cli`
- Firebase project

### 2. Clone and Install

```bash
cd "Virtual Companion"
npm install
```

### 3. Firebase Configuration

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project
3. Enable **Email/Password Authentication**
4. Create a **Firestore Database**
5. Get your web app configuration

### 4. Environment Variables

Create a `.env` file in the project root:

```env
EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 5. Firestore Rules

In Firebase Console → Firestore → Rules, set:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      
      match /interactions/{interactionId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
  }
}
```

### 6. Run the App

```bash
# Start Expo development server
npm start

# Or run directly on device/emulator
npm run android
npm run ios
```

## Project Structure

```
virtual-companion/
├── App.tsx                    # Root component
├── global.css                 # Tailwind directives
├── tailwind.config.js         # NativeWind config
├── assets/                    # App icons and images
└── src/
    ├── app/
    │   └── navigation/
    │       ├── AuthStack.tsx      # Auth screen stack
    │       ├── AppTabs.tsx        # Main tab navigator
    │       └── RootNavigator.tsx  # Root with auth gating
    ├── context/
    │   ├── AuthContext.tsx        # Auth state
    │   ├── UserContext.tsx        # Friend state
    │   └── NotificationContext.tsx
    ├── screens/
    │   ├── auth/
    │   │   ├── LoginScreen.tsx
    │   │   ├── RegisterScreen.tsx
    │   │   └── CreateFriendScreen.tsx
    │   ├── home/
    │   │   └── HomeScreen.tsx
    │   ├── communityOrHistory/
    │   │   └── HistoryScreen.tsx
    │   └── settings/
    │       └── SettingsScreen.tsx
    ├── services/
    │   ├── firebase.ts            # Firebase init
    │   ├── authService.ts         # Auth operations
    │   ├── userService.ts         # Firestore operations
    │   └── notificationService.ts # Push notifications
    └── utils/
        ├── dates.ts               # Date formatting
        └── stateMachine.ts        # State transitions
```

## State Transitions

| Action | hungry → | tired → | happy → | bored → |
|--------|----------|---------|---------|---------|
| 🍎 Feed | happy | bored | happy | happy |
| 🎮 Play | bored | tired | happy | happy |
| 💤 Rest | tired | happy | happy | tired |

## Notification Schedule

| Friend State | Notification Delay | Message |
|--------------|-------------------|---------|
| hungry | 2 hours | "Beslenmeye ihtiyacı var 🍎" |
| bored | 3 hours | "Birlikte oynamak istiyor 🎮" |
| tired | 4 hours | "Dinlenmek istiyor 💤" |
| happy | 6 hours | "Arkadaşın seni özledi 🥺" |

## Testing Notifications

1. Go to **Settings** tab
2. Enable **Notifications** toggle
3. Tap **Test Notification** 
4. Wait 5 seconds for test notification

> ⚠️ For full notification testing, use a development build (`npx expo run:android`) instead of Expo Go.

## License

MIT
