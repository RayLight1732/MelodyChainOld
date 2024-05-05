import { getThumbnailURL } from "./music.mjs";

export async function createVideoImage(musicId, name, thumbneilRef) {
  const videoItem = document.createElement("div");
  videoItem.classList.add("video-item");
  videoItem.setAttribute("name", "video-item");
  videoItem.addEventListener("click", (event) => {
    window.location.href = `./songDetail.html?id=${musicId}`;
  });

  // img要素を作成してvideo-itemに追加
  //TODO
  const img = document.createElement("img");
  img.src = await getThumbnailURL(thumbneilRef);
  img.alt = "";
  videoItem.appendChild(img);

  // p要素を作成してvideo-itemに追加
  const p = document.createElement("p");
  p.textContent = name;
  videoItem.appendChild(p);
  return videoItem;
  //最終的に追加するときは
  //container.appendChild(videoItem);
}
