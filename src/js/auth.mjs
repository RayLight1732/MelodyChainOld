import { signOut as fbSignOut } from "firebase/auth";
import { auth, db, messaging } from "./initialize.mjs";
import { deleteDoc, doc, serverTimestamp, setDoc } from "firebase/firestore";
import { getToken } from "firebase/messaging";

/**
 * 初期化が終わった際や、ログイン状態が更新された際に呼び出される
 * @param {} onAuthenticated ログインが完了している際に呼び出されるコールバック
 * @param {} onNotAuthenticated ログインが完了していない際に呼び出されるコールバック
 */
export function onAuthStateChanged(onAuthenticated, onNotAuthenticated) {
  auth.onAuthStateChanged((user) => {
    if (!user) {
      onNotAuthenticated();
    } else {
      console.log("use is not null");
      onAuthenticated();
    }
  });
}

/**
 * ログインページにリダイレクトする
 */
export function redirectToLoginPage() {
  window.location.href = "./";
}

export async function signOut() {
  await fbSignOut(auth);
  deleteDoc(
    doc(db, "users", auth.currentUser.uid, "token", MediaDeviceInfo.deviceId)
  );
}

export function registerToken() {
  console.log("registor token");
  getToken(messaging, {
    vapidKey:
      "BPsx8odGYwd3o7Crq-ekf29o9PoLn3SJ30fBgqS3Q76jkFjcptMseaAVIripyTmHo8yUQAc1Z2UxbgrlzRrEtRY",
  })
    .then((currentToken) => {
      if (currentToken) {
        setDoc(doc(db, "users", auth.currentUser.uid, "token", currentToken), {
          token: currentToken,
          timestamp: serverTimestamp(),
        }).catch((error) => {
          console.error("error in token registration", error);
        });
      } else {
        // Show permission request.
        console.log(
          "No registration token available. Request permission to generate one."
        );
      }
    })
    .catch((error) => {
      console.error("There was an error retrieving the token", error);
    });
}
