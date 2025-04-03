// src/pages/Register.js
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "../CSS/Register.module.css";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");
  const [password, setPassword] = useState("");
  const [accountHolderName, setAccountHolderName] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [ifscCode, setIfscCode] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
  
    const userData = {
      name,
      email,
      contact,
      password,
      bankDetails: {
        accountHolderName,
        bankName,
        accountNumber,
        ifscCode,
      },
    };
  
    console.log("User Data to be Sent:", userData); // 🔍 Debugging Line
  
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/auth/register`,
        userData
      );
  
      if (response.status === 201) {
        alert("Registration successful!");
        navigate("/login");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className={styles.registerContainer}>
      <h1 className={styles.heading}>Welcome to E-Bidding</h1>
      <form onSubmit={handleSubmit} className={styles.registerForm}>
        <h2>Register</h2>
        {error && <p className={styles.error}>{error}</p>}

        <div className={styles.inputRow}>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Full Name" required />
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
        </div>

        <div className={styles.inputRow}>
          <input type="tel" value={contact} onChange={(e) => setContact(e.target.value)} placeholder="Contact Number" required />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
        </div>

        <h3 className={styles.subHeading}>Bank Details</h3>

        <div className={styles.inputRow}>
          <input type="text" value={accountHolderName} onChange={(e) => setAccountHolderName(e.target.value)} placeholder="Account Holder's Name" required />
          <input type="text" value={bankName} onChange={(e) => setBankName(e.target.value)} placeholder="Bank Name" required />
        </div>

        <div className={styles.inputRow}>
          <input type="text" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} placeholder="Account Number" required />
          <input type="text" value={ifscCode} onChange={(e) => setIfscCode(e.target.value)} placeholder="IFSC Code" required />
        </div>

        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
