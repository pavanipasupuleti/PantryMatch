import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

const API = "http://localhost:5055/api/auth";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem("pm_token"));
  const [isGuest, setIsGuest] = useState(() => localStorage.getItem("pm_guest") === "true");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      fetch(`${API}/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((r) => (r.ok ? r.json() : Promise.reject()))
        .then((u) => setUser(u))
        .catch(() => {
          localStorage.removeItem("pm_token");
          setToken(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token]);

  const login = async (email, password) => {
    const res = await fetch(`${API}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Login failed");
    localStorage.setItem("pm_token", data.token);
    localStorage.removeItem("pm_guest");
    setToken(data.token);
    setUser(data.user);
    setIsGuest(false);
  };

  const register = async (name, email, password) => {
    const res = await fetch(`${API}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Registration failed");
    localStorage.setItem("pm_token", data.token);
    localStorage.removeItem("pm_guest");
    setToken(data.token);
    setUser(data.user);
    setIsGuest(false);
  };

  const continueAsGuest = () => {
    localStorage.setItem("pm_guest", "true");
    localStorage.removeItem("pm_token");
    setIsGuest(true);
    setUser(null);
    setToken(null);
  };

  const logout = () => {
    localStorage.removeItem("pm_token");
    localStorage.removeItem("pm_guest");
    setToken(null);
    setUser(null);
    setIsGuest(false);
  };

  const isAuthenticated = !!user || isGuest;

  return (
    <AuthContext.Provider
      value={{ user, token, isGuest, isAuthenticated, loading, login, register, continueAsGuest, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
