import { createContext, useState, useEffect } from "react";
import Cookies from "js-cookie";
import apiClient from "../services/ApiClient";

// Create the context
export const AuthContext = createContext();

// Auth Provider component
export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(Cookies.get("token") || null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch user info using the token
  const fetchUser = async () => {
    try {
      const res = await apiClient.get("/auth/me")
      const data = await res.data;
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
      const res =await apiClient.post("/auth/token",{email,password})

    //   const response = await fetch("http://localhost:8000/login/", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({ email, password }),
    // });

      const data=await res.data
      const  jwt=data.access_token;
    

      Cookies.set("token", jwt, { expires: 1 });
      setToken(jwt);

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
