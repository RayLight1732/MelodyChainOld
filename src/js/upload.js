import { onAuthStateChanged, redirectToLoginPage } from "./auth.mjs";
import { getMusicURLs, updateDispatchUI, uploadMusic } from "./music.mjs";
import { setFooterIcon } from "./profile.mjs";

function registerThreeObserver() {
  const uploadButton = document.querySelector("#upload button");

  const fileInput = document.getElementById("fileInput");
  const titleInput = document.getElementById("title_input");
  const thumbnailInput = document.getElementById("thumbnail_input");

  function updateUploadButtonState() {
    // タイトルが入力されていて、サムネイルが選択されているか確認
    const isFileSelected = fileInput.files.length > 0;
    const isTitleFilled = titleInput.value.trim() !== "";
    const isThumbnailSelected = thumbnailInput.files.length > 0;

    // すべての条件が真であればボタンを有効にし、そうでなければ無効にする
    if (isTitleFilled && isThumbnailSelected && isFileSelected) {
      uploadButton.disabled = false;
      uploadButton.style.backgroundColor = ""; // デフォルトの背景色を使用
      uploadButton.style.color = ""; // デフォルトのテキスト色を使用
    } else {
      uploadButton.disabled = true;
      uploadButton.style.backgroundColor = "#ccc"; // 灰色の背景色
      uploadButton.style.color = "#666"; // 濃い灰色のテキスト
    }
  }

  fileInput.addEventListener("change", updateUploadButtonState);

  // タイトル入力欄の変更を監視
  titleInput.addEventListener("input", updateUploadButtonState);

  // サムネイル入力欄の変更を監視
  thumbnailInput.addEventListener("change", updateUploadButtonState);

  // 初期状態でボタンを無効にし、スタイルを適用する
  uploadButton.disabled = true;
  uploadButton.style.backgroundColor = "#ccc"; // 灰色の背景色
  uploadButton.style.color = "#666"; // 濃い灰色のテキスト
}

function registerOneObserver() {
  const uploadButton = document.querySelector("#upload button");

  const fileInput = document.getElementById("fileInput");

  function updateUploadButtonState() {
    // タイトルが入力されていて、サムネイルが選択されているか確認
    const isFileSelected = fileInput.files.length > 0;

    // すべての条件が真であればボタンを有効にし、そうでなければ無効にする
    if (isFileSelected) {
      uploadButton.disabled = false;
      uploadButton.style.backgroundColor = ""; // デフォルトの背景色を使用
      uploadButton.style.color = ""; // デフォルトのテキスト色を使用
    } else {
      uploadButton.disabled = true;
      uploadButton.style.backgroundColor = "#ccc"; // 灰色の背景色
      uploadButton.style.color = "#666"; // 濃い灰色のテキスト
    }
  }

  fileInput.addEventListener("change", updateUploadButtonState);
  // 初期状態でボタンを無効にし、スタイルを適用する
  uploadButton.disabled = true;
  uploadButton.style.backgroundColor = "#ccc"; // 灰色の背景色
  uploadButton.style.color = "#666"; // 濃い灰色のテキスト
}

function setup() {
  let part;
  setFooterIcon();

  updateDispatchUI(async (doc) => {
    const uploadDiv = document.getElementById("upload_div");
    const errorField = document.getElementById("error");
    if (doc.data() && doc.data().dispatch.state == "dispatched") {
      errorField.style.display = "none";
      uploadDiv.style.display = "block";
      //データが存在=曲が割り当てられていた時
      const name_thumbnail = document.getElementById("name-thumbnail");
      part = doc.data().dispatch.part;
      console.log(part);
      name_thumbnail.style.display = part == 3 ? "block" : "none";
      if (part == 3) {
        registerThreeObserver();
      } else {
        registerOneObserver();
      }
      try {
        const urls = await getMusicURLs(
          doc.data().dispatch.authorIDs,
          doc.data().dispatch.previousRefs
        );
        for (const url of urls) {
          //TODO 表示
          console.log(url);
        }
      } catch (error) {
        console.error(
          "There was an error while retrieving the music URLs.",
          error
        );
      }
    } else {
      //データが存在しない=曲が割り当てられていない時
      console.log("data is null");
      errorField.style.display = "block";
      uploadDiv.style.display = "none";
    }
  });

  document.getElementById("upload").addEventListener("click", async () => {
    const [file] = document.getElementById("fileInput").files;
    try {
      if (part == 3) {
        const name = document.getElementById("title_input").value;
        const [thumbnailImage] =
          document.getElementById("thumbnail_input").files;
        await uploadMusic(file, name, thumbnailImage);
      } else {
        await uploadMusic(file);
        window.location.href = "./top.html";
      }
    } catch (error) {
      console.error("failed to upload the music.", error);
      alert("楽曲の投稿に失敗しました");
    }
  });
}

onAuthStateChanged(setup, redirectToLoginPage);
