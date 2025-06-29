import { createContext, useState, useEffect } from "react";
import Cookies from "js-cookie";

// Create the context
export const AuthContext = createContext();

// Auth Provider component
export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(Cookies.get("token") || null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch user info using the token
  const fetchUser = async (jwt) => {
    try {
      const res = await fetch("http://localhost:8000/auth/me", {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });

      if (!res.ok) throw new Error("Token invalid");

      const data = await res.json();
      setUser(data);
    } catch (err) {
      console.error("Auth error:", err);
      logout();
    } finally {
      setLoading(false);
    }
  };

  // On initial mount or when token changes
  useEffect(() => {
    if (token) {
      fetchUser(token);
    } else {
      setLoading(false);
    }
  }, [token]);

  // Login method
  const login = async (email, password) => {
    try {
      const res = await fetch("http://localhost:8000/auth/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) throw new Error("Login failed");

      const data = await res.json();
      const jwt = data.access_token;

      Cookies.set("token", jwt, { expires: 1 });
      setToken(jwt);

      await fetchUser(jwt); // Fetch user after setting token
    } catch (error) {
      throw error; // Let components handle UI error messages
    }
  };

  // Logout method
  const logout = () => {
    Cookies.remove("token");
    setToken(null);
    setUser(null);
  };

  // Provide context
  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
