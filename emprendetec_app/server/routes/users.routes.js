import express from "express";
const router = express.Router();
import firebaseProvider from "../config/firebase/firebase-provider.cjs";
import { isSignedIn } from "../sessions/session-provider.js";
import {
  validateEmail,
  validatePassword,
} from "../../common/utils/validations.js";
import { runStoredProcedure } from "../config/database/database-provider.js";

// POST /api/usuarios
// Creates a new user when the user signs up
router.post("/registro", async (req, res) => {
  // First we check if the user is already signed in
  if (await isSignedIn(req)) {
    res.status(403).json({
      message: "No puede crear una cuenta si tiene una sesión activa.",
    });
    return;
  }

  // Validate the input
  const { givenName, familyName, email, password } = req.body;
  if (!givenName || !familyName || !email || !password) {
    res.status(400).json({ message: "Faltan parámetros." });
    return;
  }

  const emailValidation = validateEmail(req.body.email);

  if (!emailValidation.isValid) {
    res
      .status(400)
      .json({ message: "Correo inválido.", errors: emailValidation.errors });
    return;
  }

  const passwordValidation = validatePassword(req.body.password);

  if (!passwordValidation.isValid) {
    res.status(400).json({
      message: "Contraseña inválida.",
      errors: passwordValidation.errors,
    });
    return;
  }

  // Create the user
  firebaseProvider
    .auth()
    .createUser({
      email: email,
      emailVerified: false,
      password: password,
      displayName: `${givenName} ${familyName}`,
    })
    .then(async (userRecord) => {
      // Store the user in the database
      runStoredProcedure("EmprendeTEC_SP_Users_SignUP", {
        IN_firebaseUid: userRecord.uid,
        IN_givenName: givenName,
        IN_familyName: familyName,
        IN_email: email,
      })
        .then(() => {
          res.json({ message: "Usuario creado." });
        })
        .catch((error) => {
          res.status(error?.cause ? 400 : 500).json({ message: error?.cause });

          // Delete the user from Firebase
          firebaseProvider.auth().deleteUser(userRecord.uid);
        });
    })
    .catch((error) => {
      let message = undefined;
      // Handle different types of errors
      switch (error.code) {
        case "auth/email-already-exists":
          message = `El correo electrónico "${email}" ya está registrado.`;
          break;
        case "auth/invalid-email":
          message = "El correo electrónico es inválido.";
          break;
        case "auth/invalid-password":
          message = "La contraseña es inválida.";
          break;
        default:
          console.error("Error creating new user:", error);
          break;
      }
      res.status(message ? 400 : 500).json({ message: message });
    });
});

export default router;
