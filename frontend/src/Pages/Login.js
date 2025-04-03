import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../Context/AuthContext"; // Import context
import styles from "../CSS/Login.module.css";

const Login = () => {
  const { login } = useContext(AuthContext); // Use login from context
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/login`, {
        email,
        password,
      });

      

    if (response.status === 200) {
      const { token } = response.data; // Ensure backend returns 'token'
      
      if (!token || token.split(".").length !== 3) {
        throw new Error("Invalid JWT token received.");
      }

      if(login(token)){
        navigate("/dashboard")
      }
     
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    }
  };

  return (
    <div className={styles.loginContainer}>
      <h1 className={styles.heading}>Welcome to E-Bidding</h1>
      <div className={styles.loginFormContainer}>
        <h2>Login</h2>
        {error && <p className={styles.error}>{error}</p>}
        <form className={styles.loginForm} onSubmit={handleSubmit}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
