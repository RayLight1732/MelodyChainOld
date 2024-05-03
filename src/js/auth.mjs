import { auth } from "./initialize.mjs";

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
