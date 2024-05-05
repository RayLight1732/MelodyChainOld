import { db, auth, storage } from "./initialize.mjs";
import {
  collection,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  where,
  limit as funcLimit,
  startAfter as funcStartAfter,
  setDoc,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

function getMusicRef() {
  return collection(db, "music");
}

/**
 * この関数が呼ばれた直後と、楽曲割り当て状態の更新が行われた際に、コールバックを呼び出す
 * @see {@link https://firebase.google.com/docs/firestore/query-data/listen?hl=ja}
 * @param {*} onSnapshotCallback
 * @returns
 */
export function updateDispatchUI(onSnapshotCallback) {
  return onSnapshot(doc(db, "users", auth.currentUser.uid), onSnapshotCallback);
}

/**
 * 楽曲をアップロードする
 * @param {File} musicFile 担当パートの音楽
 * @param {string} [name] 楽曲の名前
 * @param {File} [thumbnail] サムネイル
 * @throws アップロードが失敗した場合エラー
 */
export async function uploadMusic(musicFile, name, thumbnail) {
  const result = await auth.currentUser.getIdTokenResult(true);

  if (name) {
    await setDoc(doc(db, "music_names", auth.currentUser.uid), {
      name: name,
      ref: result.claims.ref,
    });
  }

  if (thumbnail) {
    const thumbnailRef = ref(
      storage,
      `users/${auth.currentUser.uid}/thumbnail/${result.claims.ref}`
    );
    await uploadBytes(thumbnailRef, thumbnail);
  }

  const storageRef = ref(
    storage,
    `users/${auth.currentUser.uid}/music/${result.claims.ref}`
  );
  await uploadBytes(storageRef, musicFile);
  console.log("upload success");
}

/**
 * 楽曲のダウンロード用URLを取得する
 * @param {Array<string>} authorIds 作成者の配列 インデックス0:ドラム,1:ベース,2:ギター,3:ボーカル
 * @param {Array<string>} refs 楽曲の参照の配列 インデックス0:ドラム,1:ベース,2:ギター,3:ボーカル
 * @returns {Array<URL>} ダウンロード用URLの配列
 */
export async function getMusicURLs(authorIDs, refs) {
  console.log("auth ref", authorIDs, refs);
  const urls = [];
  for (var i = 0; i < authorIDs.length; i++) {
    const url = await getDownloadURL(
      ref(storage, `users/${authorIDs[i]}/music/${refs[i]}`)
    );
    urls.push(url);
  }
  console.log("urls", urls);
  return urls;
}

/**
 * 楽曲のサムネイル用URLを取得する
 * @param {string} ref サムネイルの参照
 * @returns {URL} ダウンロード用URL
 */
export async function getThumbnailURL(ref_) {
  return await getDownloadURL(ref(storage, ref_));
}

/**
 * 関与した楽曲を取得する
 * @param {string} [uid=uid=ログインしているユーザーのuid] uid
 * @returns ドキュメントの配列 @see {@link https://firebase.google.com/docs/firestore/query-data/get-data?hl=ja}
 */
export async function getInvolvedMusic(uid = auth.currentUser.uid) {
  const q = query(
    getMusicRef(),
    where("authorIDs", "array-contains", uid),
    orderBy("date", "desc")
  );
  return await getDocs(q);
}

/**
 * 全ての楽曲の中からいくつかを取得する
 * @param {number} [limit=10] 取得する数
 * @param {} [startAfter] 指定したドキュメントの後から取得を開始する
 * @returns スナップショット @see {@link https://firebase.google.com/docs/firestore/query-data/get-data?hl=ja}
 * for(const value of returnValue)で楽曲が取れる
 */
export async function getMusic(limit = 10, startAfter) {
  //即時関数
  const q = (() => {
    if (startAfter) {
      return query(
        getMusicRef(),
        orderBy("date", "desc"),
        funcLimit(limit),
        funcStartAfter(startAfter)
      );
    } else {
      return query(getMusicRef(), orderBy("date", "desc"), funcLimit(limit));
    }
  })();
  return await getDocs(q);
}

export async function getMusicDetail(musicId) {
  return await getDoc(doc(db, "music", musicId));
}

/**
 * 楽曲はドキュメント@see {@link https://firebase.google.com/docs/firestore/query-data/get-data?hl=ja}で帰ってくる
 * const data = doc.data()
 * としたとき、
 * data.authorIDs:関わった人のIDの配列
 * data.musicRefs:楽曲の参照の配列
 * data.thumbnailRef:サムネイル画像の参照
 * data.date:作成日時
 * data.name:楽曲の名前
 */
