import { createContext, useContext, useEffect, useState } from "react";
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "../firebase";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      try {
        if (currentUser) {
          const idToken = await currentUser.getIdToken();
          setUser(currentUser);
          setToken(idToken);
        } else {
          setUser(null);
          setToken(null);
        }
      } catch (err) {
        console.error("Auth state transition error:", err);
        setUser(null);
        setToken(null);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  async function login(email, password) {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    const idToken = await cred.user.getIdToken();
    setUser(cred.user);
    setToken(idToken);
    return cred.user;
  }

  async function logout() {
    await signOut(auth);
    setUser(null);
    setToken(null);
  }

  async function getIdToken(forceRefresh = false) {
    if (!auth.currentUser) return null;
    const freshToken = await auth.currentUser.getIdToken(forceRefresh);
    setToken(freshToken);
    return freshToken;
  }

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    getIdToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
