import express from "express";
const router = express.Router();
import { runStoredProcedure } from "../config/database/database-provider.js";
import { checkPermissions, currentUser } from "../sessions/session-provider.js";

router.post(
  "/",
  (req, res, next) => {
    const { email } = req.body;
    return checkPermissions(["Administrator"], true, email ? [email] : [])(
      req,
      res,
      next
    );
  },
  async (req, res) => {
    try {
      const { email, postId, score, comment } = req.body;

      if (!email || !postId || !score) {
        return res.status(400).json({ message: "Faltan datos obligatorios." });
      }

      const result = await runStoredProcedure("EmprendeTEC_SP_RatePost", {
        IN_authorEmail: email,
        IN_postId: postId,
        IN_rating: score,
        IN_comment: comment,
      });

      return res
        .status(200)
        .json({ message: "Calificación agregada correctamente." });
    } catch (error) {
      console.error("Error al agregar reseña:", error);
      res
        .status(500)
        .json({ message: "Ocurrió un error al agregar la calificación." });
    }
  }
);

router.get("/emprendimiento/:id", async (req, res) => {
  const { id } = req.params;
  const user = await currentUser(req);

  try {
    const result = await runStoredProcedure("EmprendeTEC_SP_GetPostRating", {
      IN_postId: id,
      IN_currentEmail: user?.email,
    });

    if (result.length === 0) {
      return res
        .status(404)
        .json({ message: "No se encontró el emprendimiento." });
    }

    res.json({ post: result[0] });
  } catch (error) {
    res
      .status(500)
      .json({
        message:
          "Ocurrió un error al obtener la calificación del emprendimiento.",
      });
  }
});

export default router;
