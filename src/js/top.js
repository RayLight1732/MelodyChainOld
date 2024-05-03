import { onAuthStateChanged, redirectToLoginPage } from "./auth.mjs";
import { auth } from "./initialize.mjs";
import { signOut } from "firebase/auth";

function setup() {
  const button1 = document.getElementById("mypage");
  button1.addEventListener("click", () => {
    window.location.href = "./mypage.html";
  });

  const button2 = document.getElementById("logout");
  button2.addEventListener("click", async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.log(e);
    }
  });

  const button3 = document.getElementById("upload");
  button3.addEventListener("click", () => {
    window.location.href = "./upload.html";
  });
}

onAuthStateChanged(setup, redirectToLoginPage);
