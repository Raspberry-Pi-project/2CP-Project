import { createContext, useContext, useEffect, useState } from "react";
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // Initialize user state from sessionStorage if available
  const [user, setUser] = useState(() => {
    const savedUser = sessionStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : {};
  });

  // Update sessionStorage when user state changes
  useEffect(() => {
    if (user && Object.keys(user).length > 0) {
      sessionStorage.setItem("user", JSON.stringify(user));
    } else {
      sessionStorage.removeItem("user");
    }
    console.log("user : ", user);
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
