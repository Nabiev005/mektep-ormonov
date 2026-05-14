import { initializeApp } from "firebase/app";
import { getFirestore, initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from "firebase/firestore"; 
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBYOkhC3oPniYwlnlnevbExsIxFwa1a2UI",
  authDomain: "mektep-admin.firebaseapp.com",
  projectId: "mektep-admin",
  storageBucket: "mektep-admin.firebasestorage.app",
  messagingSenderId: "849433394944",
  appId: "1:849433394944:web:b4f257c27f787587bb3de5",
};

const app = initializeApp(firebaseConfig);


export const db = (() => {
  try {
    return initializeFirestore(app, {
      localCache: persistentLocalCache({
        tabManager: persistentMultipleTabManager(),
      }),
    });
  } catch {
    return getFirestore(app);
  }
})();
export const auth = getAuth(app);
export const storage = getStorage(app);
