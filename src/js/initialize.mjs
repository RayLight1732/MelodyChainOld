import { getApps, getApp, initializeApp } from "firebase/app";
import { doc, getFirestore, serverTimestamp, setDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

export const getQueryParam = (key) => {
  const value = window.location.href.match(
    new RegExp("[?&]" + key + "=(.*?)(&|$|#)")
  );
  if (value == null) return "";
  return decodeURIComponent(value[1]);
};

const firebaseConfig = {
  apiKey: "AIzaSyCJMFqxaQixVdqcDa4hUDW26RrVz3_Meow",
  authDomain: "melody-chain.firebaseapp.com",
  projectId: "melody-chain",
  storageBucket: "melody-chain.appspot.com",
  messagingSenderId: "826270602514",
  appId: "1:826270602514:web:f54ce41f6ab7538fe08fcb",
};

const firebaseApp = !getApps().length
  ? initializeApp(firebaseConfig)
  : getApp();

export function isNotificationGranted() {
  return Notification.permission === "granted";
}

export function isNotificationAsked() {
  return Notification.permission !== "default";
}

export const db = getFirestore(firebaseApp);
export const auth = getAuth();
export const storage = getStorage();

export const messaging = getMessaging(firebaseApp);

Notification.requestPermission().then((permission) => {
  if (permission === "granted") {
    // 通知を許可した場合
    console.log("Notification permission granted.");
  } else {
    // 通知を拒否した場合
    console.log("Unable to get permission to notify.");
  }
});

onMessage(messaging, (payload) => {
  console.log("Message received. ", payload);
});
