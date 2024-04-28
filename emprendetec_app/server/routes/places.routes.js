import express from "express";
const router = express.Router();
import { searchMap } from "../config/mapData/mapData-provider.cjs";
import { normalizeString } from "../../common/utils/normalization.js";

router.get("/buscar", async (req, res) => {
  res.status(400).json({ message: "Debés proporcionar un término de búsqueda." });
});

router.get("/buscar/:searchTerm", async (req, res) => {
  const { searchTerm } = req.params;
  const normalizedSearchTerm = searchTerm ? normalizeString(searchTerm) : "";

  if (!searchTerm) {
    return res.status(400).json({ message: "Debés proporcionar un término de búsqueda." });
  }

  try {
    const results = searchMap(normalizedSearchTerm);
    res.json({ results });
  } catch (error) {
    console.error("Error al buscar en el mapa:", error);
    res.status(500).json({ message: "Ocurrió un error al buscar en el mapa." });
  }
});

export default router;