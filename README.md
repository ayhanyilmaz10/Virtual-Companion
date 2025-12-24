
# Sanal Arkadaşım 🐰 (Virtual Companion)

Expo, React Native, TypeScript, NativeWind ve Firebase ile oluşturulmuş, kawaii temalı bir sanal arkadaş mobil uygulaması.

## Özellikler

* 🔐 **Firebase Kimlik Doğrulama** - E-posta/şifre ile kayıt olma ve giriş yapma.
* 🐰 **Sanal Dost** - Kendi sevimli arkadaşınızı oluşturun ve onunla ilgilenin.
* 🍎 **Etkileşimler** - Arkadaşınızı besleyin, onunla oyun oynayın ve onu dinlendirin.
* 📊 **Durum Yönetimi** - Arkadaşınızın farklı modları: aç, yorgun, mutlu, sıkılmış.
* 📜 **Geçmiş** - Tüm etkileşimlerinizi ve arkadaşınızla yaptıklarınızı takip edin.
* 🔔 **Bildirimler** - Arkadaşınızın size ihtiyacı olduğunda yerel bildirimler alın.
* 🎨 **Kawaii Tasarım** - Yumuşak animasyonlarla desteklenmiş pastel renkli tema.

## Kullanılan Teknolojiler

* **Framework**: Expo (Managed Workflow)
* **Dil**: TypeScript
* **Stil**: NativeWind (React Native için Tailwind CSS)
* **Navigasyon**: React Navigation (Stack + Bottom Tabs)
* **Durum Yönetimi**: React Context + useReducer
* **Arka Plan (Backend)**: Firebase (Auth + Firestore)
* **Bildirimler**: Expo Notifications

## Kurulum

### 1. Gereksinimler

* Node.js 18+
* npm veya yarn
* Expo CLI: `npm install -g expo-cli`
* Bir Firebase projesi

### 2. Klonlama ve Yükleme

```bash
cd "Virtual Companion"
npm install

```

### 3. Firebase Yapılandırması

1. [Firebase Console](https://console.firebase.google.com) üzerinden yeni bir proje oluşturun.
2. **Email/Password Authentication** özelliğini aktif edin.
3. **Firestore Database** oluşturun.
4. Web uygulaması yapılandırma (config) bilgilerini alın.

### 4. Ortam Değişkenleri

Proje ana dizininde bir `.env` dosyası oluşturun ve bilgilerinizi ekleyin:

```env
EXPO_PUBLIC_FIREBASE_API_KEY=api_anahtariniz
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=projeniz.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=proje_id_niz
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=projeniz.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=gonderici_id_niz
EXPO_PUBLIC_FIREBASE_APP_ID=uygulama_id_niz

```

### 5. Uygulamayı Çalıştırma

```bash
# Expo sunucusunu başlatın
npm start

# Veya doğrudan cihazda/emülatörde çalıştırın
npm run android
npm run ios

```

### 5. Görseller

![notification](https://github.com/user-attachments/assets/c4cfae7e-500a-45f8-a734-9524209ef0c5)
![settings](https://github.com/user-attachments/assets/f1148c4c-3e62-42e4-8ffd-e372b5c0adee)
![history](https://github.com/user-attachments/assets/63394661-e5eb-41e2-8c47-8627f78b5bba)
![home](https://github.com/user-attachments/assets/a1212207-063a-4136-91ac-c0fece3b8068)

## Durum Geçişleri

| Eylem | Aç → | Yorgun → | Mutlu → | Sıkılmış → |
| --- | --- | --- | --- | --- |
| 🍎 Besle | Mutlu | Sıkılmış | Mutlu | Mutlu |
| 🎮 Oyna | Sıkılmış | Yorgun | Mutlu | Mutlu |
| 💤 Dinlendir | Yorgun | Mutlu | Mutlu | Yorgun |

## Bildirim Takvimi

| Arkadaşın Durumu | Bildirim Gecikmesi | Mesaj |
| --- | --- | --- |
| Aç | 2 saat | "Beslenmeye ihtiyacı var 🍎" |
| Sıkılmış | 3 saat | "Birlikte oynamak istiyor 🎮" |
| Yorgun | 4 saat | "Dinlenmek istiyor 💤" |
| Mutlu | 6 saat | "Arkadaşın seni özledi 🥺" |

---
