import {
  //必要なものをインポートする
  GoogleAuthProvider,
  getRedirectResult,
  signInWithRedirect,
} from "firebase/auth";
import { onAuthStateChanged, registerToken } from "./auth.mjs";
import { auth, db } from "./initialize.mjs";

//Google認証プロバイダの設定:
const provider = new GoogleAuthProvider();
provider.setCustomParameters({
  prompt: "select_account",
});

//リダイレクト関数
function redirectToTopPage() {
  console.log("redirect to top");
  window.location.href = "./top.html";
}

//ログイン関数:
function login() {
  console.log("login");
  signInWithRedirect(auth, provider);
}

//リダイレクト結果の処理:
getRedirectResult(auth)
  .then((result) => {
    console.log("result", result);
    if (result !== null) {
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      console.log(token);
      // The signed-in user info.
      const user = result.user;
      console.log(user);
      console.log(user.uid);
      registerToken();
      console.log("register token");
      redirectToTopPage();
    }
  })
  .catch((error) => {
    console.error(error);
    // Handle Errors here.
    //showError("ログインに失敗しました。もう一度お試しください。");
    const errorCode = error.code;
    const errorMessage = error.message;
    const email = error.email;
    console.error(errorCode);
    console.error(errorMessage);
    console.error(email);
    // The AuthCredential type that was used.
    //const credential = GoogleAuthProvider.credentialFromError(error);
  });

//イベントリスナーと認証状態の監視:
document.getElementById("login").addEventListener("click", login);

onAuthStateChanged(
  () => {},
  () => {
    console.log("not logined");
    //showError("ログインが必要です。");
  }
);

/*
//エラーメッセージを表示する関数
function showError(message) {
  const errorDiv = document.getElementById("error-message");
  errorDiv.textContent = message;
  errorDiv.style.display = "block"; // エラーメッセージを表示
}*/
