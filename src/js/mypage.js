import { onAuthStateChanged } from "./auth.mjs";
import { getInvolvedMusic, getMusicURLs } from "./music.mjs";
import {
  updateProfileUI,
  uploadProfile,
  getProfileImageUrl,
} from "./profile.mjs";

const redirectHandler = () => (window.location.href = "http://localhost:3000");
async function setup() {
  //画像選択用UIにイベントリスナーを追加
  const imageSelector = document.getElementById("image_selector");
  const figureImage = document.getElementById("figure_image");
  const figure = document.getElementById("figure");
  imageSelector.addEventListener("change", (event) => {
    //画像が選択されたことを表すプロパティ
    imageSelector.changed = true;
    const [file] = event.target.files;
    if (file) {
      figureImage.setAttribute("src", URL.createObjectURL(file));
      figure.style.display = "block";
    } else {
      figure.style.display = "none";
    }
  });

  try {
    //プロフィール画像のURLを取得し、取得に成功したら表示する
    const url = await getProfileImageUrl();
    if (url) {
      figureImage.setAttribute("src", url);
      figure.style.display = "block";
    } else {
      figure.style.display = "none";
    }
  } catch (error) {
    console.error("Failed to retrieve the profile image.");
    console.log(error);
  }

  const name = document.getElementById("name");
  const favorite = document.getElementById("favorite");
  const part = document.getElementById("part_selector");
  updateProfileUI((doc) => {
    if (doc.data()) {
      name.value = doc.data().name;
      favorite.value = doc.data().favorite;
      part.value = doc.data().part;
    }
  });
  const button = document.getElementById("update");
  button.addEventListener("click", () => {
    const image = imageSelector.changed ? imageSelector.files[0] : null;
    console.log(name.value);
    uploadProfile(name.value, favorite.value, part.value, image);
  });

  //制作に携わった楽曲を取得
  try {
    const involvedMusic = await getInvolvedMusic();
    involvedMusic.forEach((doc) => {
      console.log(`${doc.data().name}`);
      getMusicURLs(doc.data().authorIDs, doc.data().musicRefs)
        .then((urls) => {
          console.log(urls);
        })
        .catch((error) => {
          console.error("There was an error while retrieving the music URLs.");
          console.log(error);
        });
    });
  } catch (error) {
    console.error("There was an error while retrieving the involved musics.");
    console.log(error);
  }
}

onAuthStateChanged(setup, redirectHandler);
