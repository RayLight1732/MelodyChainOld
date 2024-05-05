import { onAuthStateChanged, redirectToLoginPage } from "./auth.mjs";
import { getQueryParam } from "./initialize.mjs";
import {
  uploadMusic,
  updateDispatchUI,
  getMusicDetail,
  getMusicURLs,
} from "./music.mjs";
import { getProfileImageUrl, setFooterIcon } from "./profile.mjs";

const partList = ["ドラム", "ベース", "ギター", "メロディー"];

function resizeScrollableContainer() {
  const header = document.getElementById("header");
  const footer = document.getElementById("footer");
  const profileView = document.getElementById("scrollable-container");
  profileView.style.height = `${
    window.innerHeight - header.clientHeight - footer.clientHeight
  }px`;
  profileView.style.marginTop = `${header.clientHeight}px`;
}

document.addEventListener("DOMContentLoaded", () => {
  resizeScrollableContainer();
});
window.addEventListener("resize", () => {
  resizeScrollableContainer();
});

async function setMusic(authorIDs, previousRefs) {
  try {
    const urls = await getMusicURLs(authorIDs, previousRefs);
    console.log("urls", urls);
    const mediaListTop = document.getElementById("media-list-top");
    while (mediaListTop.firstChild) {
      mediaListTop.removeChild(mediaListTop.firstChild);
    }
    for (var i = 0; i < urls.length; i++) {
      const url = urls[i];

      const div = document.createElement("div");
      div.classList.add("media-list");
      div.innerHTML = `<ul>
          <li class="media-item">
            <img  alt="Art" class="user-icon" />
            <span class="part-name">${partList[i]}</span>
            <button class="play-button" type="button"><img src="../img/play-button.png" alt=""></button>
          </li>
        </ul>`;
      div
        .getElementsByTagName("button")[0]
        .addEventListener("click", (event) => {
          if (div.a) {
            const lastA = div.a;
            lastA.pause();
            lastA.currentTime = 0;

            lastA.play();
          } else {
            const a = new Audio(url);
            div.a = a;
            a.play();
          }
        });
      div.getElementsByTagName("img")[0].addEventListener("click", (event) => {
        window.location.href = `./mypage.html?uid=${authorIDs[i]}`;
      });
      try {
        div.getElementsByTagName("img")[0].src = await getProfileImageUrl(
          authorIDs[i]
        );
      } catch (error) {
        console.log("cannot get image url", error);
      }

      mediaListTop.appendChild(div);
      console.log("add child");
    }
    //全部再生ボタン
    console.log(urls.length);
    if (urls.length >= 2) {
      console.log("try create");
      const div = document.createElement("div");
      div.classList.add("media-list");
      div.innerHTML = `<ul>
        <li class="media-item">
          <span class="part-name">再生</span>
          <button class="play-button" type="button"><img src="../img/play-button.png" alt=""></button>
        </li>
      </ul>`;
      div
        .getElementsByTagName("button")[0]
        .addEventListener("click", (event) => {
          if (div.a) {
            const lastA = div.a;
            for (const audio of lastA) {
              audio.pause();
              lastA.currentTime = 0;

              lastA.play();
            }
          } else {
            const a = urls.map((url) => new Audio(url));
            div.a = a;
            for (const audio of a) {
              audio.play();
            }
          }
        });
      console.log("add all play");
      mediaListTop.appendChild(div);
    }
    resizeScrollableContainer();
  } catch (error) {
    console.error("There was an error while retrieving the music URLs.", error);
  }
}

function setup() {
  setFooterIcon();
  const param = getQueryParam("id");
  const uploadDiv = document.getElementById("upload_div");
  const errorField = document.getElementById("error");
  if (!param) {
    updateDispatchUI(async (doc) => {
      console.log(doc.data());
      if (doc.data() && doc.data().dispatch.state == "dispatched") {
        //データが存在=曲が割り当てられていた時
        errorField.style.display = "none";
        uploadDiv.style.display = "block";
        const part = partList[doc.data().dispatch.part];
        document.getElementById(
          "note-part"
        ).textContent = `あなたは${part}パート担当です\nBPM:${
          doc.data().dispatch.tempo
        }`;

        await setMusic(
          doc.data().dispatch.authorIDs,
          doc.data().dispatch.previousRefs
        );
      } else {
        //データが存在しない=曲が割り当てられていない時
        console.log("data is null");
        errorField.style.display = "block";
        uploadDiv.style.display = "none";
      }
    });
  } else {
    errorField.style.display = "none";
    uploadDiv.style.display = "none";
    console.log(param);
    getMusicDetail(param)
      .then((doc) => {
        setMusic(doc.data().authorIDs, doc.data().musicRefs);
      })
      .catch((error) => console.log("error on get music detail", error));
  }
}

onAuthStateChanged(setup, redirectToLoginPage);
