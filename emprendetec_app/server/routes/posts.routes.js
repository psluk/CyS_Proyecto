import express from "express";
const router = express.Router();
import firebaseProvider from "../config/firebase/firebase-provider.cjs";
import { runStoredProcedure } from "../config/database/database-provider.js";

router.get("/", async (req, res) => {
  try {
    // Ejecutar el procedimiento almacenado para obtener los detalles de todos los usuarios
    const result = await runStoredProcedure("GetPosts");

    // Verificar si se encontraron datos de usuario
    if (result.length === 0) {
      return res.status(404).json({ message: "No se encontraron emprendimientos." });
    }

    // Devolver los detalles de todos los usuarios en la respuesta
    res.json({ posts: result });
  } catch (error) {
    console.error('Error al obtener emprendimientos:', error);
    res.status(500).json({ message: "Ocurrió un error al obtener los emprendimientos." });
  }
});

export default router;
