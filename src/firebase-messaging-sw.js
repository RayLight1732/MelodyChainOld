import { initializeApp } from "firebase/app";
import { getMessaging, onBackgroundMessage } from "firebase/messaging/sw";
// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
const firebaseApp = initializeApp({
  apiKey: "AIzaSyCJMFqxaQixVdqcDa4hUDW26RrVz3_Meow",
  authDomain: "melody-chain.firebaseapp.com",
  projectId: "melody-chain",
  storageBucket: "melody-chain.appspot.com",
  messagingSenderId: "826270602514",
  appId: "1:826270602514:web:f54ce41f6ab7538fe08fcb",
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = getMessaging(firebaseApp);
onBackgroundMessage(messaging, (payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload
  );
  // Customize notification here
  const data = payload.data;
  if (data) {
    if (data.type == "0") {
      const notificationTitle = "楽曲完成通知";
      const notificationOptions = {
        body: data.text,
      };

      self.registration.showNotification(
        notificationTitle,
        notificationOptions
      );
    } else if (data.type == "1") {
      const notificationTitle = "楽曲割り当て通知";
      const notificationOptions = {
        body: data.text,
      };

      self.registration.showNotification(
        notificationTitle,
        notificationOptions
      );
    }
  }
});
