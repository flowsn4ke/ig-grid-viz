import { openDB } from "idb";

const DB_NAME = "imagesDB";
const STORE_NAME = "images";

export async function getDB() {
  return await openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    },
  });
}

export async function saveImage(image) {
  const db = await getDB();
  await db.put(STORE_NAME, image);
}

export async function deleteImage(id) {
  const db = await getDB();
  await db.delete(STORE_NAME, id);
}

export async function getAllImages() {
  const db = await getDB();
  return await db.getAll(STORE_NAME);
}
