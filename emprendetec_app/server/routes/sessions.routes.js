import express from "express";
const router = express.Router();
import { currentUser } from "../sessions/session-provider.js";
import { runStoredProcedure } from "../config/database/database-provider.js";

router.get("/", async (req, res) => {
  // Indicates if the user is signed in
  const user = await currentUser(req);
  if (user) {
    runStoredProcedure("EmprendeTEC_SP_Users_SignIn", {
      IN_firebaseUid: user.uid,
    })
      .then((result) => {
        if (result.length === 0) {
          res.status(403).json({ message: "El usuario no existe." });
          return;
        }
        res.json({ user: result[0] });
      })
      .catch(() => {
        res.status(500).json({ message: "Ocurrió un error." });
      });
  } else {
    res.status(403).json({ message: "El usuario no tiene una sesión activa." });
  }
});

export default router;
