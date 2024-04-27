import express from "express";
const router = express.Router();
import { runStoredProcedure } from "../config/database/database-provider.js";

router.get("/", async (req, res) => {
  try {
    console.log("entra Emprendimientos");
    // Ejecutar el procedimiento almacenado para obtener los detalles de todos los emprendimientos
    const result = await runStoredProcedure("GetPosts");

    // Verificar si se encontraron datos de emprendimientos
    if (result.length === 0) {
      return res
        .status(404)
        .json({ message: "No se encontraron emprendimientos." });
    }

    // Devolver los detalles de todos los emprendimientos en la respuesta
    res.json({ posts: result });
    console.log(result);
  } catch (error) {
    console.error("Error al obtener emprendimientos:", error);
    res
      .status(500)
      .json({ message: "Ocurrió un error al obtener los emprendimientos." });
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    // Ejecutar el procedimiento almacenado para obtener los detalles del emprendimiento solicitado
    const result = await runStoredProcedure("GetPost", { inPostID: id });
    console.log(result);

    // Verificar si se encontraron datos del emprendimiento solicitado
    if (result.length === 0) {
      return res
        .status(404)
        .json({ message: "No se encontraron emprendimientos." });
    }

    // Devolver los detalles del emprendimiento solicitado en la respuesta
    res.json({ post: result });
  } catch (error) {
    console.error("Error al obtener emprendimientos:", error);
    res
      .status(500)
      .json({ message: "Ocurrió un error al obtener los emprendimientos." });
  }
});

router.get("/usuario/:id", async (req, res) => {
  const { id } = req.params;
  try {
    // Ejecutar el procedimiento almacenado para obtener los emprendimientos de un usuario
    const result = await runStoredProcedure("GetPostsUser", {inUserID: id});

    // Verificar si se encontraron datos de los emprendimientos del usuario
    if (result.length === 0) {
      return res
        .status(404)
        .json({ message: "No se encontraron emprendimientos." });
    }

    // Devolver los detalles de los emprendimientos del usuario en la respuesta
    res.json({ posts: result });
  } catch (error) {
    console.error("Error al obtener emprendimientos:", error);
    res.status(500).json({
      message: "Ocurrió un error al obtener los emprendimientos.",
    });
  }
});
router.get("/imagenes/:id", async (req, res) => {
  const { id } = req.params;
  try {
    console.log("entraNuevo2: " + id);
    // Ejecutar el procedimiento almacenado para obtener las imagenes del emprendimiento solicitado
    const result = await runStoredProcedure("GetImagesPost", {
      inPostID: id,
    });
    console.log(result);

    // Verificar si se encontraron imagenes del emprendimiento solicitado
    if (result.length === 0) {
      return res.status(404).json({ message: "No se encontraron imagenes." });
    }

    // Devolver las imagenes del emprendimiento solicitado en la respuesta
    res.json({ images: result });
  } catch (error) {
    console.error("Error al obtener imagenes:", error);
    res
      .status(500)
      .json({ message: "Ocurrió un error al obtener los imagenes." });
  }
});

router.post("/crear", async (req, res) => {
  try {
    const { name, description, userEmail, images } = req.body;

    const imageUrlsString = images.join(',');

    await runStoredProcedure("EmprendeTEC_SP_SaveProject", {
      IN_userEmail: userEmail,
      IN_projectName: name,
      IN_description: description,
      IN_images: imageUrlsString
    });

    res.status(200).json({ message: "Proyecto guardado correctamente" });
  } catch (error) {
    console.error("Error al guardar el proyecto:", error);
    res
      .status(500)
      .json({ message: "Ocurrió un error al guardar el proyecto" });
  }
});

export default router;
