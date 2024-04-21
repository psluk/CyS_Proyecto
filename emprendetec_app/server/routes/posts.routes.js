import express from "express";
const router = express.Router();
import { runStoredProcedure } from "../config/database/database-provider.js";



router.get("/", async (req, res) => {
  try {
    console.log("entra Emprendimientos");
    // Ejecutar el procedimiento almacenado para obtener los detalles de todos los usuarios
    const result = await runStoredProcedure("GetPosts");
    

    // Verificar si se encontraron datos de usuario
    if (result.length === 0) {
      return res.status(404).json({ message: "No se encontraron emprendimientos." });
    }

    // Devolver los detalles de todos los usuarios en la respuesta
    res.json({ posts: result });
    console.log(result);
  } catch (error) {
    console.error('Error al obtener emprendimientos:', error);
    res.status(500).json({ message: "Ocurrió un error al obtener los emprendimientos." });
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    console.log("entraNuevo2: " + id);
    // Ejecutar el procedimiento almacenado para obtener los detalles de todos los usuarios
    const result = await runStoredProcedure("GetPost", {inPostID: id});
    console.log(result);

    // Verificar si se encontraron datos de usuario
    if (result.length === 0) {
      return res.status(404).json({ message: "No se encontraron emprendimientos." });
    }

    // Devolver los detalles de todos los usuarios en la respuesta
    res.json({ post: result });
  } catch (error) {
    console.error('Error al obtener emprendimientos:', error);
    res.status(500).json({ message: "Ocurrió un error al obtener los emprendimientos." });
  }
});




router.post("/crear", async (req, res) => {
  try {
    const { name, description, imageFiles, userEmail } = req.body;
    console.log("entraNuevo" + name);
    console.log("entraNuevo" + description);
    console.log("entraNuevo" + userEmail);
    console.log("entraNuevo" + imageFiles.name);

    const imageUrls = [];
    imageFiles.forEach((file, index) => {
      console.log(`Archivo ${index + 1}:`);
      console.log(`Nombre: ${file.name}`);
      console.log(`Tipo: ${file.type}`);
      console.log(`Tamaño: ${file.size} bytes`);
    });

   
     

     // Subir cada imagen a Firebase y guardar la URL
     for (const imageFile of imageFiles) {
      console.log("imageFile: " + imageFile);
       const imageUrl = await uploadImage(imageFile.file);
       imageUrls.push(imageUrl);
     }


    // Llamar al procedimiento almacenado para guardar el proyecto
    // await runStoredProcedure("EmprendeTEC_SP_SaveProject", {
    //   IN_userEmail: userEmail,
    //   IN_projectName: name,
    //   IN_description: description,
    //   IN_images: `<Images>${imagesXML}</Images>`
    // });

    res.status(200).json({ message: "Proyecto guardado correctamente" });
  } catch (error) {
    console.error("Error al guardar el proyecto:", error);
    res.status(500).json({ message: "Ocurrió un error al guardar el proyecto" });
  }
});







export default router;
