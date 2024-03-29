import express from "express";
const router = express.Router();
import { currentUser } from "../sessions/session-provider.js";
import { runStoredProcedure } from "../config/database/database-provider.js";

router.get("/usuarios", async (req, res) => {
  try {
    // Ejecutar el procedimiento almacenado para obtener los detalles de todos los usuarios
    const result = await runStoredProcedure("GetUserDetails");

    // Verificar si se encontraron datos de usuario
    if (result.length === 0) {
      return res.status(404).json({ message: "No se encontraron detalles de ningún usuario." });
    }

    // Devolver los detalles de todos los usuarios en la respuesta
    res.json({ users: result });
  } catch (error) {
    console.error('Error al obtener detalles de los usuarios:', error);
    res.status(500).json({ message: "Ocurrió un error al obtener detalles de los usuarios." });
  }
});


export default router;
