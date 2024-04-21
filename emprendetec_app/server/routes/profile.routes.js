import express from "express";
const router = express.Router();
import { runStoredProcedure } from "../config/database/database-provider.js";

router.get("/:email", async (req, res) => {
  const { email } = req.params;
  try {
    // Ejecutar el procedimiento almacenado para obtener datos del usuario
    const result = await runStoredProcedure("GetProfileData", {inUserEmail: email});
    console.log(result);

    // Verificar si se encontraron datos del usuario
    if (result.length === 0) {
      return res.status(404).json({ message: "No se encontró el ususario." });
    }

    // Devolver los detalles del usuario en la respuesta
    res.json({ user: result });
  } catch (error) {
    console.error('Error al obtener usuario:', error);
    res.status(500).json({ message: "Ocurrió un error al obtener el usuario." });
  }
});

router.get("/usuario/:id", async (req, res) => {
  const { id } = req.params;
  console.log('Entra a usuario ' + id);
  try {
    // Ejecutar el procedimiento almacenado para obtener datos del usuario
    const result = await runStoredProcedure("GetProfileDataID", {inUserID: id});
    console.log(result);

    // Verificar si se encontraron datos del usuario
    if (result.length === 0) {
      return res.status(404).json({ message: "No se encontró el ususario." });
    }

    // Devolver los detalles del usuario en la respuesta
    res.json({ user: result });
  } catch (error) {
    console.error('Error al obtener usuario:', error);
    res.status(500).json({ message: "Ocurrió un error al obtener el usuario." });
  }
});

export default router;
