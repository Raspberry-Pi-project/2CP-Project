import { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode"; // To decode JWT

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const storedRole = localStorage.getItem("role");
  const [user, setUser] = useState({}/*storedRole ? { role: storedRole } : null*/);
  
  /*useEffect(() => {
    const token = Cookies.get("token"); // Read JWT from cookies
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser({ id: decoded.id, role: decoded.role }); // Store user data
      } catch (error) {
        console.error("Invalid token:", error);
        setUser(null);
      }
    }
  }, []);*/

  return (
    <AuthContext.Provider value={{ user , setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
