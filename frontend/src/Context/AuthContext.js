import { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode"; // Correct import
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Function to get user from token
  const getUserFromToken = () => {
    const token = localStorage.getItem("Token") || localStorage.getItem("adminToken");
    if (token) {
      try {
        const decodedUser = jwtDecode(token); // Decode the token to get user
        return decodedUser;
      } catch (error) {
        console.error("Invalid token:", error);
        localStorage.removeItem("Token") || localStorage.removeItem("adminToken"); // Remove invalid token
      }
    }
    return null;
  };

  useEffect(() => {
    setUser(getUserFromToken());

    // Sync user state with localStorage changes
    const handleStorageChange = () => {
      setUser(getUserFromToken());
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
    
  }, []);

  // Check if user is an admin
  const isAdmin = (user) => {
    return user?.role === "admin"; // Admin check based on role
  };
  const isUser = (user) => {
    return user?.role === "user"; // Admin check based on role
  };

  // Login function
  const login = (token) => {
    if(isUser){
      localStorage.setItem("Token", token);
    }
    else{
      localStorage.setItem("adminToken", token);
    }
    setUser(getUserFromToken()); // Update state
    navigate(isAdmin() ? "/admin-dashboard" : "/dashboard"); // Redirect based on role
    return true;
  };

  // Logout function
  const logout = () => {
    if(isAdmin){
      localStorage.removeItem("adminToken");
      navigate("/admin/login");
      sessionStorage.removeItem("sessionActive"); // Clear session flag
      setUser(null);
    }
    else{
      localStorage.removeItem("Token");
      navigate("/login");
      sessionStorage.removeItem("sessionActive"); // Clear session flag
      setUser(null);
    }
  };

   // Auto-logout when browser closes using `visibilitychange`
   useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        setTimeout(() => {
          if (document.visibilityState === "hidden") {
            localStorage.removeItem("Token");
            localStorage.removeItem("adminToken");
            sessionStorage.removeItem("sessionActive");
            setUser(null);
            console.log("User logged out due to browser close.");
          }
        }, 3000); // Wait 3 seconds to confirm browser close
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};
