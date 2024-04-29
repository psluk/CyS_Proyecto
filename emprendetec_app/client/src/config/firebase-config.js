import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
// The web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDtTnHyVuGu3OmlWb2WDiruFZSAu4bLuHA",
  authDomain: "emprendetec-7fe80.firebaseapp.com",
  projectId: "emprendetec-7fe80",
  storageBucket: "gs://emprendetec-7fe80.appspot.com",
  messagingSenderId: "209184059134",
  appId: "1:209184059134:web:e4b3f5f4dabbe5b68bbfaf",
  measurementId: "G-HBQCQLKPBV",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

if (
  process.env.NODE_ENV !== "development" &&
  window.location.hostname !== "localhost"
) {
  getAnalytics(app);
}
const uploadFilesAndGetDownloadURLs = async (files) => {
  const downloadURLs = [];

  for (const file of files) {
    const storageRef = ref(storage, `images/${file.name}`);
    try {
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      downloadURLs.push(downloadURL);
    } catch (error) {
      console.error('Error al subir el archivo:', error);
    }
  }

  return downloadURLs;
};

export { storage, uploadFilesAndGetDownloadURLs };
