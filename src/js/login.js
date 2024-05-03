import {
  GoogleAuthProvider,
  getRedirectResult,
  signInWithRedirect,
  signInWithPopup,
} from "firebase/auth";
import { onAuthStateChanged } from "./auth.mjs";
import { auth } from "./initialize.mjs";

const provider = new GoogleAuthProvider();

//always select account
provider.setCustomParameters({
  prompt: "select_account",
});

function redirectToTopPage() {
  console.log("redirect to top");
  window.location.href = "./top.html";
}

function login() {
  signInWithRedirect(auth, provider);
  //signInWithPopup(auth, provider);
}

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
    }
  })
  .catch((error) => {
    console.error(error);
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
    const email = error.email;
    console.error(errorCode);
    console.error(errorMessage);
    console.error(email);
    // The AuthCredential type that was used.
    //const credential = GoogleAuthProvider.credentialFromError(error);
  });

document.getElementById("login").addEventListener("click", login);
onAuthStateChanged(redirectToTopPage, () => {
  console.log("not logined");
});
