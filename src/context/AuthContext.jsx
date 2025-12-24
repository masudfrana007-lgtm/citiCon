import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    console.log('[Auth] fetchUser() called');

    try {
      const res = await fetch('/auth/me', {
        credentials: 'include',
      });
      const data = await res.json();
      console.log('[Auth] /auth/me response:', data);

      if (data && data.user_id) {
        console.log('[Auth] setting user:', data);
        setUser(data); // { user_id, name, email }
      } else {
        console.log('[Auth] clearing user (null)');
        setUser(null);
      }
    } catch (err) {
      console.error('[Auth] fetchUser error:', err);
      setUser(null);
    } finally {
      console.log('[Auth] loading = false');
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('[Auth] AuthProvider mounted');
    fetchUser();
  }, []);

  useEffect(() => {
    console.log('[Auth] user changed:', user);
  }, [user]);  

  // Expose refresh function
  const refreshUser = () => fetchUser();

  return (
    <AuthContext.Provider value={{ user, setUser, loading, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};
