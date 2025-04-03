import { Link, useNavigate } from "react-router-dom";
import { useContext, useEffect } from "react";
import { AuthContext } from "../Context/AuthContext"; // Correct import
import styles from "../CSS/Navbar.module.css";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext); // Use context directly
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    window.addEventListener("beforeunload", () => {
      localStorage.removeItem("Token") || localStorage.removeItem("adminToken");
    });
    navigate("/login"); // Redirect after logout
  };

  // useEffect(() => {
  //   const token = localStorage.getItem("Token") || localStorage.getItem("adminToken");
  //   if (!token) {
  //     console.error("No token found, user might be logged out.");
  //     return;
  //   }

   
  // },[user])
  return (
    <nav className={styles.navbar}>
      <h1 className={styles.navbarLogo}>E-Bidding</h1>
      <div className={styles.navbarMenu}>
        {user ? (
          <>
            {user?.role === "admin" ? (
              // Admin-specific Links
              <>
                <Link to="/admin/users" className={styles.navbarLink}>
                  Manage Users
                </Link>
                <Link to="/admin/auctions" className={styles.navbarLink}>
                  Manage Auctions
                </Link>
              </>
            ) : (
              // Regular User-specific Links
              <>
                <Link to="/dashboard" className={styles.navbarLink}>
                  Dashboard
                </Link>
                <Link to="/profile" className={styles.navbarLink}>
                  Profile
                </Link>
                <Link to="/participate-auction" className={styles.navbarLink}>
                  Participate
                </Link>
              </>
            )}
            <button onClick={handleLogout} className={styles.logoutBtn}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/" className={styles.navbarLink}>Home</Link>
            <Link to="/login" className={styles.loginBtn}>Login</Link>
            <Link to="/register" className={styles.registerBtn}>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
