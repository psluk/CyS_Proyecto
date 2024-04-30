import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
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
let analytics = null;
if (
  process.env.NODE_ENV !== "development" &&
  window.location.hostname !== "localhost"
) {
  analytics = getAnalytics(app);
}
const uploadFilesAndGetDownloadURLs = async (files) => {
  const downloadURLs = [];
  const timestamp = Date.now();
  for (const file of files) {
    const storageRef = ref(storage, `images/${file.name}-${timestamp}`);
    try {
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      downloadURLs.push(downloadURL);
    } catch (error) {
      console.error("Error al subir el archivo:", error);
    }
  }

  return downloadURLs;
};

const deleteImageByUrl = async (imageUrl) => {
  try {
    // Obtén una referencia al archivo en Firebase Storage usando su URL
    const storageRef = ref(storage, imageUrl);

    // Elimina el archivo de Firebase Storage
    await deleteObject(storageRef);

    console.log(`Imagen ${imageUrl} eliminada correctamente de Firebase Storage.`);
  } catch (error) {
    console.error('Error al eliminar la imagen de Firebase Storage:', error);
    throw error;
  }
};

export { storage, uploadFilesAndGetDownloadURLs, deleteImageByUrl, analytics };
