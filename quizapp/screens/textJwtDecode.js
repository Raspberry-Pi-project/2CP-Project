// utils/jwt.js
import jwtDecode from "jwt-decode";

export const decodeToken = (token) => {
  try {
    return jwtDecode(token);
  } catch (error) {
    console.error("JWT Decode failed:", error);
    return null;
  }
};
