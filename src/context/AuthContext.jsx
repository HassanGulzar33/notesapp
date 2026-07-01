import { createContext, useContext, useEffect, useState } from 'react';
import {
  signIn,
  signUp,
  confirmSignUp,
  signOut,
  getCurrentUser,
  fetchUserAttributes,
} from 'aws-amplify/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  async function refreshUser() {
    try {
      const current = await getCurrentUser();
      const attrs = await fetchUserAttributes();
      setUser({ ...current, attrs });
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refreshUser();
  }, []);

  async function doSignUp(email, password) {
    await signUp({
      username: email,
      password,
      options: { userAttributes: { email } },
    });
  }

  async function doConfirmSignUp(email, code) {
    await confirmSignUp({ username: email, confirmationCode: code });
  }

  async function doSignIn(email, password) {
    await signIn({ username: email, password });
    await refreshUser();
  }

  async function doSignOut() {
    await signOut();
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{ user, loading, doSignUp, doConfirmSignUp, doSignIn, doSignOut, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
