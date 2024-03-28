import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

const INITIAL_STATE = JSON.parse(localStorage.getItem("session")) || null;

const SessionContext = createContext(INITIAL_STATE);

const useSession = () => {
  const session = useContext(SessionContext);
  if (session === undefined) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return session;
};

const SessionProvider = ({ children }) => {
  const [user, setUser] = useState(INITIAL_STATE);
  const [loading, setLoading] = useState(INITIAL_STATE !== null);

  useEffect(() => {
    if (user) {
      localStorage.setItem("session", true);
    } else {
      localStorage.removeItem("session");
    }
  }, [user]);

  const getUserType = () => {
    return user?.customClaims?.userType;
  };

  const getUserEmail = () => {
    return user?.email;
  };

  const getUserName = () => {
    return {
      givenName: user?.customClaims?.givenName,
      familyName: user?.customClaims?.familyName,
    };
  };

  const isUserType = (type) => {
    return getUserType() === type;
  };

  const isEmailVerified = () => {
    return user?.emailVerified;
  };

  const login = (email, password) => {
    setLoading(true);
    const auth = getAuth();
    return new Promise((resolve, reject) => {
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          resolve(userCredential);
        })
        .catch((error) => {
          reject(error);
          setLoading(false);
        });
    });
  };

  const logout = () => {
    const auth = getAuth();
    return signOut(auth);
  };

  const updateUser = async (authUser) => {
    if (authUser) {
      const token = await authUser.getIdToken();
      const { data } = await axios.get("/api/sesiones", {
        headers: {
          Authorization: token,
        },
      });
      setUser({ ...authUser, customClaims: data.user });
    } else {
      setUser(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, updateUser);
    return () => unsubscribe();
  }, []);

  return (
    <SessionContext.Provider
      value={{
        user,
        loading,
        getUserType,
        getUserEmail,
        getUserName,
        isUserType,
        isEmailVerified,
        login,
        logout,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};

export { SessionProvider, useSession };
