import { onAuthStateChanged, redirectToLoginPage } from "./auth.mjs";
import { getMusicURLs, updateDispatchUI, uploadMusic } from "./music.mjs";

function setup() {
  let part;

  updateDispatchUI(async (doc) => {
    const uploadDiv = document.getElementById("upload_div");
    const errorField = document.getElementById("error");
    if (doc.data() && doc.data().dispatch != "None") {
      errorField.style.display = "none";
      uploadDiv.style.display = "block";
      //データが存在=曲が割り当てられていた時
      const name = document.getElementById("name");
      part = doc.data().dispatch.part;
      name.style.display = part == 3 ? "block" : "none";

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
    const [file] = document.getElementById("selector").files;
    try {
      const name = part == 3 ? document.getElementById("name").value : null;
      await uploadMusic(file, name);
    } catch (error) {
      console.error("failed to upload the music.", error);
    }
  });
}

onAuthStateChanged(setup, redirectToLoginPage);
