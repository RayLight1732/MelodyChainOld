import { auth, db, storage } from "./initialize.mjs";
import { getDownloadURL, uploadBytes, ref } from "firebase/storage";
import { doc, setDoc, onSnapshot, getDoc } from "firebase/firestore";

/**
 * プロフィール画像の参照を取得する
 * @param {string} [uid=ログインしているユーザーのuid] 対象のuid
 * @returns プロフィール画像の参照
 */
export function getProfileImageRef(uid = auth.currentUser.uid) {
  return ref(storage, "users/" + uid + "/profile.png");
}

/**
 * プロフィールを取得する
 * @param {string}[uid=ログインしているユーザー] 対象のuid
 * @returns プロフィール returnValue.data().[name/favorite/part]でそれぞれの値を取得することができる
 */
export async function getProfile(uid = auth.currentUser.uid) {
  return await getDoc(doc(db, "users", uid));
}

/**
 * プロフィールをアップロードする
 * @param {string} name 名前
 * @param {string} favorite 好きなバンド
 * @param {number} part パート(0:)
 * @param {File} [image] 画像
 * @returns アップロードが成功した場合true,そうでないならfalse
 */
export async function uploadProfile(name, favorite, part, image) {
  if (auth.currentUser) {
    //画像のアップロード
    try {
      if (image) {
        await uploadBytes(getProfileImageRef(), image).then((snapshot) => {
          console.log("The image upload was successful.");
        });
      }

      //ユーザーデータのアップロード
      await setDoc(doc(db, "users", auth.currentUser.uid), {
        uid: auth.currentUser.uid,
        name: name,
        favorite: favorite,
        part: part,
      });
      return true;
    } catch (error) {
      console.error("The profile upload failed.");
      console.log(error);
      return false;
    }
  } else {
    console.error(
      "The file upload was attempted for a user who hasn't completed authentication."
    );
    return false;
  }
}

/**
 * この関数が呼ばれた直後と、ユーザープロフィールの更新が行われた際に、コールバックを呼び出す。
 * 何らかの理由でデータベースの書き込みが失敗した際に、失敗前の値をコールバックで取得することができる。
 * @see https://firebase.google.com/docs/firestore/query-data/listen?hl=ja
 * @param {} onSnapshotCallback
 * @param {string} [uid=ログインしているユーザーのuid] uid
 * @returns
 */
export function updateProfileUI(
  onSnapshotCallback,
  uid = auth.currentUser.uid
) {
  return onSnapshot(doc(db, "users", uid), onSnapshotCallback);
}

/**
 *
 * @param {string} [uid=ログインしているユーザーのuid] uid
 * @returns {URL} プロフィール画像のURL
 * @throws データが取得できなかった時エラー
 */
export async function getProfileImageUrl(uid = auth.currentUser.uid) {
  return await getDownloadURL(getProfileImageRef(uid));
}
