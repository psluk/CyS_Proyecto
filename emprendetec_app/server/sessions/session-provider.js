import firebaseProvider from "../config/firebase/firebase-provider.cjs";
import { runStoredProcedure } from "../config/database/database-provider.js";

const verifySocketToken = async (socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    return next(new Error("Authentication error"));
  }
  try {
    const user = await firebaseProvider.auth().verifyIdToken(token);
    socket.user = user;
    next();
  } catch (error) {
    return next(new Error("Authentication error"));
  }
};

/**
 * Returns the current user
 * @param {*} req The request object
 * @returns The current user if it exists, otherwise undefined
 */
const currentUser = async (req) => {
  const token = req.headers.authorization;
  if (!token) {
    return undefined;
  }
  try {
    const user = await firebaseProvider.auth().verifyIdToken(token);
    return user;
  } catch (error) {
    return undefined;
  }
};

/**
 * Checks if the user is signed in
 * @param {*} req The request object
 * @returns True if the user is signed in, otherwise false
 */
const isSignedIn = async (req) => {
  const user = await currentUser(req);
  return user !== undefined;
};

/**
 * Checks the permissions of the user.
 * @param {(string|null)[]} validRoles The roles that are allowed to access the resource. If the array contains null, the resource is public.
 * @param {boolean} needsVerifiedEmail Indicates if the user needs to have a verified email to access the resource.
 * @param {string[]} validUsers The emails of the users that are allowed to access the resource even if they don't have the required role.
 * @returns {(function(*, *, *): Promise<undefined|*>)|*} The middleware function.
 */
const checkPermissions = (
  validRoles = [null],
  needsVerifiedEmail = false,
  validUsers = []
) => {
  return async (req, res, next) => {
    if (validRoles.includes(null)) {
      // Allow guest users
      next();
      return;
    }

    const user = await currentUser(req);
    if (!user) {
      // The user needs to be signed in
      return res
        .status(401)
        .json({ message: "Debés iniciar sesión para continuar." });
    }

    if (needsVerifiedEmail && !user.email_verified) {
      // The user needs to have a verified email, which they don't have
      return res
        .status(403)
        .send({
          message:
            "No podés continuar sin haber verificado tu correo electrónico.",
        });
    }

    if (validUsers.includes(user.email)) {
      // Allow specific users
      next();
      return;
    }

    const onErrorMessage =
      "No fue posible comprobar que tengás permisos para ejecutar esta acción.";

    // Get the user's role
    runStoredProcedure("EmprendeTEC_SP_Users_SignIn", {
      IN_firebaseUid: user.uid,
    })
      .then((result) => {
        if (result.length === 0) {
          res.status(403).json({ message: onErrorMessage });
          return;
        }

        if (!validRoles.includes(result[0].userType)) {
          res
            .status(403)
            .json({ message: "No tenés permisos para ejecutar esta acción." });
          return;
        }

        next();
      })
      .catch(() => {
        res.status(500).json({ message: onErrorMessage });
      });
  };
};

export { currentUser, isSignedIn, checkPermissions , verifySocketToken};
