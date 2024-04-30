import express from "express";
const router = express.Router();
import firebaseProvider from "../config/firebase/firebase-provider.cjs";
import { isSignedIn } from "../sessions/session-provider.js";
import {
  validateEmail,
  validatePassword,
} from "../../common/utils/validations.js";
import { runStoredProcedure } from "../config/database/database-provider.js";
import { checkPermissions } from "../sessions/session-provider.js";



router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    // Ejecutar el procedimiento almacenado para obtener datos del usuario
    const result = await runStoredProcedure("GetProfileData", {inUserID: id});
    //console.log(result);

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

router.put("/editar-perfil", async (req, res) => {
  // Validate the input
  const { givenName, familyName, password, email, image } = req.body;

  try {
    // Update user from local database
    const result = await runStoredProcedure("UpdateUser", { IN_email: email, IN_givenName: givenName, IN_familyName: familyName, IN_imageUser: image});
    
    // Verify stored procedure result
    if (result === 1) {
      res.json({ message: "Usuario actualizado exitosamente." });
    } else if (result === -1) {
      res.status(404).json({ message: "El usuario no existe en la base de datos local." });
    } else if (result === -2) {
      res.status(500).json({ message: "Error interno del servidor al actualizar el usuario." });
    } else {
      res.status(500).json({ message: "Resultado inesperado del procedimiento almacenado." });
    }
    console.log("Resultado del procedimiento almacenado:", result);

    // Actualizar usuario de Firebase Authentication
    if (password != '') {
      const passwordValidation = validatePassword(password);
  
      if (!passwordValidation.isValid) {
        res.status(400).json({
          message: "Contraseña inválida.",
          errors: passwordValidation.errors,
        });
        return;
      }
  
      await firebaseProvider.auth().getUserByEmail(email)
        .then(async (userRecord) => {
          await firebaseProvider.auth().updateUser(userRecord.uid, {
            password: password,
            displayName: `${givenName} ${familyName}`,
          })
        })
        .catch((error) => {
          console.error('Error al actualizar usuario de Firebase:', error);
          res.status(404).json({ message: "El usuario no existe." });
          return;
        });
      return;
    }
  
    await firebaseProvider.auth().getUserByEmail(email)
      .then(async (userRecord) => {
        await firebaseProvider.auth().updateUser(userRecord.uid, {
          displayName: `${givenName} ${familyName}`,
        })
      })
      .catch((error) => {
        console.error('Error al actualizar usuario de Firebase:', error);
        res.status(404).json({ message: "El usuario no existe." });
        return;
      });
  } catch (error) {
    console.error("Error al actualizar usuario:", error);
    res.status(500).json({ message: "Error interno del servidor." });
  }
});

router.get("/", async (req, res) => {
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

router.get("/top-usuarios/usuarios", async (req, res) => {
  try {
    // Ejecutar el procedimiento almacenado para obtener los detalles de todos los usuarios
    const result = await runStoredProcedure("EmprendeTEC_SP_TopUsers");

    // Verificar si se encontraron datos de usuario
    if (result.length === 0) {
      return res
        .status(404)
        .json({ message: "No se encontraron detalles de ningún usuario." });
    }

    // Devolver los detalles de todos los usuarios en la respuesta
    res.json({ users: result });
  } catch (error) {
    console.error("Error al obtener detalles de los usuarios:", error);
    res.status(500).json({
      message: "Ocurrió un error al obtener detalles de los usuarios.",
    });
  }
});

// Elimina un usuario por su correo electrónico
router.delete("/eliminar/:email",checkPermissions(['Administrator'], true), async (req, res) => {
  const { email } = req.params;

  try {
    
    // Eliminar usuario de la base de datos local
    const result = await runStoredProcedure("EmprendeTEC_SP_DeleteUser", { IN_email: email});

    console.log("Resultado del procedimiento almacenado:", result);
    // Eliminar usuario de Firebase Authentication
    await firebaseProvider.auth().getUserByEmail(email)
      .then(async (userRecord) => {
        await firebaseProvider.auth().deleteUser(userRecord.uid);
      })
      .catch((error) => {
        console.error('Error al eliminar usuario de Firebase:', error);
        res.status(404).json({ message: "El usuario no existe." });
        return;
      });

      res.status(200).json({ message: "Usuario eliminado correctamente" });
    } catch (error) {
      console.error("Error al eliminar el usuario:", error);
      res.status(error?.cause ? 400 : 500).json({ message: error?.cause });
    }
});



export default router;
