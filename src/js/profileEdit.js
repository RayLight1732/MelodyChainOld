import {
  getHeaderImageUrl,
  getProfileImageUrl,
  setFooterIcon,
  updateProfileUI,
  uploadProfile,
} from "./profile.mjs";
import { onAuthStateChanged, redirectToLoginPage } from "./auth.mjs";

function resizeScrollableContainer() {
  const header = document.getElementById("header");
  const footer = document.getElementById("footer");
  const profileView = document.getElementById("scrollable-container");
  profileView.style.height = `${
    window.innerHeight - header.clientHeight - footer.clientHeight
  }px`;
  profileView.style.marginTop = `${header.clientHeight}px`;
}

function resizeHeaderImage() {
  const element = document.getElementById("header-image");
  //const img = element.getElementsByTagName("img")[0];
  element.style.height = `${element.clientWidth * 0.6}px`;
}

document.addEventListener("DOMContentLoaded", () => {
  resizeScrollableContainer();
  resizeHeaderImage();
});
window.addEventListener("resize", () => {
  resizeScrollableContainer();
  resizeHeaderImage();
});

document
  .getElementById("header-image-pic")
  .addEventListener("click", function (event) {
    // 円がクリックされた場合は、その処理のみ実行
    if (event.target.id === "circle") return;

    // ファイル選択インプットを動的に作成
    let fileInputRectangle = document.createElement("input");
    fileInputRectangle.type = "file";
    fileInputRectangle.accept = "image/png,image/jpeg";
    fileInputRectangle.style.display = "none"; // インプットを非表示にする

    // ファイルが選択されたときのイベント
    fileInputRectangle.onchange = function (e) {
      let file = e.target.files[0];
      if (file) {
        const header = document.getElementById("header-image-pic");
        header.selected = true;
        header.file = file;
        document
          .getElementById("header-image-pic")
          .setAttribute("src", URL.createObjectURL(file));
      }
    };

    // クリックイベントを発生させる
    fileInputRectangle.click();
  });

// 円をクリックした際の処理
document.getElementById("circle").addEventListener("click", function () {
  // ファイル選択インプットを動的に作成
  let fileInputCircle = document.createElement("input");
  fileInputCircle.accept = "image/png,image/jpeg";
  fileInputCircle.type = "file";
  fileInputCircle.style.display = "none"; // インプットを非表示にする

  // ファイルが選択されたときのイベント
  fileInputCircle.onchange = function (e) {
    let file = e.target.files[0];
    if (file) {
      const circle = document.getElementById("circle");
      circle.selected = true;
      circle.file = file;
      /*
      document
        .getElementById("header-image-pic")
        .setAttribute("src", URL.createObjectURL(file));*/
    }
  };

  // クリックイベントを発生させる
  fileInputCircle.click();
});

async function setup() {
  setFooterIcon();
  getProfileImageUrl()
    .then((url) => {
      /*
      if (url) {
        figureImage.setAttribute("src", url);
        figure.style.display = "block";
      } else {
        figure.style.display = "none";
      }*/
    })
    .catch((error) => {
      console.error("Failed to retrieve the profile image.");
      console.log(error);
    });

  getHeaderImageUrl()
    .then((url) => {
      if (url) {
        document.getElementById("header-image-pic").setAttribute("src", url);
      }
    })
    .catch((error) => {
      console.error("Failed to retrieve the header image.");
      console.log(error);
    });

  const name = document.getElementById("name");
  const favorite = document.getElementById("favorite");
  const drum = document.getElementById("drum");
  const base = document.getElementById("base");
  const guiter = document.getElementById("guiter");
  const melody = document.getElementById("melody");
  const instruments = [drum, base, guiter, melody];
  updateProfileUI((doc) => {
    const profile_input = document.getElementById("profile-input");
    if (profile_input.style.display == "none") {
      profile_input.style.display = "block";
    }
    if (doc.data()) {
      name.value = doc.data().name;
      favorite.value = doc.data().favorite;
      for (const index of doc.data().part) {
        instruments[index].checked = true;
      }
    }
  });

  const button = document.getElementById("update");
  button.addEventListener("click", () => {
    const circle = document.getElementById("circle");
    const profile = circle.selected ? circle.file : null;
    const headerPic = document.getElementById("header-image-pic");
    const header = headerPic.selected ? circle.file : null;
    const part = [];
    for (var i = 0; i < 4; i++) {
      if (instruments[i].checked) {
        console.log(i, "checked");
        part.push(i);
      }
    }
    uploadProfile(name.value, favorite.value, part, profile, header)
      .then(() => {
        window.location.href = "./top.html";
      })
      .catch((error) => {
        console.log("error in uploading profile", error);
      });
  });
}

onAuthStateChanged(setup, redirectToLoginPage);
