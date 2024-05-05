import { onAuthStateChanged, redirectToLoginPage, signOut } from "./auth.mjs";
import { getMusic } from "./music.mjs";
import { setFooterIcon } from "./profile.mjs";

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

function resizeVideoGallery() {
  const header = document.getElementById("header");
  const footer = document.getElementById("footer");
  const video_gallery = document.getElementById("video-gallery");
  video_gallery.style.height = `${
    window.innerHeight - header.clientHeight - footer.clientHeight
  }px`;
  video_gallery.style.marginTop = `${header.clientHeight}px`;
}

function createVideoImage(musicId, name, thumbneilRef) {
  const videoItem = document.createElement("div");
  videoItem.classList.add("video-item");
  videoItem.setAttribute("name", "video-item");

  // img要素を作成してvideo-itemに追加
  //TODO
  const img = document.createElement("img");
  img.src = "../img/ロゴ.png";
  img.alt = "";
  videoItem.appendChild(img);

  // p要素を作成してvideo-itemに追加
  const p = document.createElement("p");
  p.textContent = "タイトル";
  videoItem.appendChild(p);

  //最終的に追加するときは
  //container.appendChild(videoItem);
}

function setup() {
  setFooterIcon();
  /*
  const mypage = document.getElementById("mypage")
  mypage.addEventListener("click", () => {
    window.location.href = "./mypage.html";
  });

  const upload = document.getElementById("upload");
  upload.addEventListener("click", () => {
    window.location.href = "./upload.html";
  });
  */
  const video_gallery = document.getElementById("video-gallery");
  console.log("add event listener");

  video_gallery.addEventListener("scroll", () => {
    if (
      video_gallery.scrollHeight <=
      video_gallery.scrollTop + video_gallery.clientHeight + 50
    ) {
      const container = document.getElementById("video-gallery");

      resizeVideoItem();
    }
  });

  const container = document.getElementById("video-gallery");

  for (var i = 0; i < 10; i++) {
    const videoItem = document.createElement("div");
    videoItem.classList.add("video-item");
    videoItem.setAttribute("name", "video-item");

    // img要素を作成してvideo-itemに追加
    const img = document.createElement("img");
    img.src = "../img/ロゴ.png";
    img.alt = "";
    videoItem.appendChild(img);

    // p要素を作成してvideo-itemに追加
    const p = document.createElement("p");
    p.textContent = "タイトル";
    videoItem.appendChild(p);

    // containerにvideo-itemを追加
    container.appendChild(videoItem);

    console.log("add");
  }
  resizeVideoItem();
}

onAuthStateChanged(setup, redirectToLoginPage);

document.addEventListener("DOMContentLoaded", () => {
  resizeVideoItem();
  resizeVideoGallery();
});
window.addEventListener("resize", () => {
  resizeVideoItem();
  resizeVideoGallery();
});
