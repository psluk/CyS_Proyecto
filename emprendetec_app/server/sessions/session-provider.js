import firebaseProvider from "../config/firebase/firebase-provider.cjs";

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

export { currentUser, isSignedIn };