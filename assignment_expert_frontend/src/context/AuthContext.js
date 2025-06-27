import { createContext, useState, useEffect } from "react";
import Cookies from "js-cookie";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(Cookies.get("token") || null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
        logout(); // handle logout if fetch fails
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchUser(token);
    } else {
      setLoading(false);
    }
  }, [token]);

  const login = async (email, password) => {
    const res = await fetch("http://localhost:8000/auth/token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) throw new Error("Login failed ");

    const data = await res.json();
    const jwt = data.access_token;

    Cookies.set("token", jwt, { expires: 1 });
    setToken(jwt);
    setUser(data.user);
  };

  const logout = () => {
    Cookies.remove("token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
