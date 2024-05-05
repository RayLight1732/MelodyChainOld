import { onAuthStateChanged, redirectToLoginPage, signOut } from "./auth.mjs";
import { auth, getQueryParam } from "./initialize.mjs";
import { getInvolvedMusic, getMusicURLs } from "./music.mjs";
import { createVideoImage } from "./musiclist";
import { getProfile, setFooterIcon } from "./profile.mjs";

function resizeHeaderImage() {
  const element = document.getElementById("header-image");
  //const img = element.getElementsByTagName("img")[0];
  element.style.height = `${element.clientWidth * 0.6}px`;
}

function resizeProfileView() {
  console.log("resize profile view");
  const header = document.getElementById("header");
  const footer = document.getElementById("footer");
  const profileView = document.getElementById("profile-view");
  profileView.style.height = `${
    window.innerHeight - header.clientHeight - footer.clientHeight
  }px`;
  profileView.style.marginTop = `${header.clientHeight}px`;
}

function resizeVideoItem() {
  const elements = document.getElementsByName("video-item");
  for (const element of elements) {
    const img = element.getElementsByTagName("img")[0];
    const p = element.getElementsByTagName("p")[0];
    const styles = window.getComputedStyle(p);
    const { marginTop, marginRight, marginBottom, marginLeft } = styles;

    const parsedObject = Object.fromEntries(
      Object.entries({
        marginTop,
        marginRight,
        marginBottom,
        marginLeft,
      }).map(([key, value]) => [key, parseFloat(value) || 0])
    );
    element.style.height = `${
      element.clientWidth * 0.6 +
      p.clientHeight +
      parsedObject.marginTop +
      parsedObject.marginBottom
    }px`;
    img.style.width = element.clientWidth + "px";
    img.style.height = element.clientWidth * 0.6 + "px";
  }
}

async function setup() {
  setFooterIcon();
  const param = getQueryParam("id");
  let uid = param ? param : auth.currentUser.uid;
  if (!param) {
    const signoutElement = document.getElementById("signout");
    signoutElement.style.display = "block";
    signoutElement.addEventListener("click", signOut);
  }
  getProfile(uid)
    .then((doc) => {
      if (!param || uid == auth.currentUser.uid) {
        document.getElementById("edit-profile").style.display = "block";
        document
          .getElementById("edit-profile")
          .addEventListener("click", (event) => {
            window.location.href = "./profileEdit.html";
          });
      }
      document.getElementById("loading").style.display = "none";
      document.getElementById("main-content").style.display = "block";
      const data = doc.data();
      console.log(data);
      document.getElementById("nickname-value").textContent = data.name;
      document.getElementById("favorite-value").textContent = data.favorite;
      resizeHeaderImage();
      resizeProfileView();
      resizeVideoItem();
    })
    .catch((error) => {
      console.log("error on get profile", error);
    });

  try {
    const involvedMusic = await getInvolvedMusic(uid);

    const container = document.getElementById("past-works-container");
    Promise.allSettled(
      involvedMusic.docs.map((doc) => {
        return createVideoImage(
          doc.data().id,
          doc.data().name,
          doc.data().thumbnailRef
        )
          .then((result) => container.appendChild(result))
          .catch((error) => {
            console.warn("error in creating video image", error);
          });
      })
    )
      .then(() => {
        resizeHeaderImage();
        resizeProfileView();

        resizeVideoItem();
      })
      .catch((error) => {
        console.error("error in promise all settled", error);
      });
  } catch (error) {
    console.error("There was an error while retrieving the involved musics.");
    console.log(error);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  resizeHeaderImage();
  resizeProfileView();

  resizeVideoItem();
});
window.addEventListener("resize", () => {
  resizeHeaderImage();
  resizeProfileView();
  resizeVideoItem();
});

onAuthStateChanged(setup, redirectToLoginPage);
