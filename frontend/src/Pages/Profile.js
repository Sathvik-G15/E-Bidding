import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import styles from "../CSS/Profile.module.css";
import { AuthContext } from "../Context/AuthContext"; // Import Auth Context

const Profile = () => {
  const { id } = useParams(); // Get user ID from URL (only present for admin views)
  const { user } = useContext(AuthContext); // Get logged-in user info
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("Token") || localStorage.getItem("adminToken"); // Token for both user and admin

        if (!token) {
          setError("User not authenticated. Please log in.");
          setLoading(false);
          return;
        }

        // If ID exists, admin is viewing another user's profile
        const url = id
        ? `${process.env.REACT_APP_API_URL}/api/admin/users/${id}`
        : `${process.env.REACT_APP_API_URL}/api/users/profile`;

        const response = await axios.get(url, 
        {  headers: { Authorization: `Bearer ${token}` },
        });

        setProfile(response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Error fetching profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id]);

  if (loading) return <p>Loading profile...</p>;
  if (error) return <p className={styles.error}>{error}</p>;

  return (
    <div className={styles.profileContainer}>
      <h1>{id ? "User Profile (Admin View)" : "My Profile"}</h1>
      <div className={styles.profileDetails}>
        <p><strong>Name:</strong> {profile?.name}</p>
        <p><strong>Email:</strong> {profile?.email}</p>
        <p><strong>Contact:</strong> {profile?.contact}</p>
      </div>

      <h2>Bank Details</h2>
      <div className={styles.bankDetails}>
        <p><strong>Account Holder Name:</strong> {profile?.bankDetails?.accountHolderName || "N/A"}</p>
        <p><strong>Account Number:</strong> {profile?.bankDetails?.accountNumber || "N/A"}</p>
        <p><strong>Bank Name:</strong> {profile?.bankDetails?.bankName || "N/A"}</p>
        <p><strong>IFSC Code:</strong> {profile?.bankDetails?.ifscCode || "N/A"}</p>
      </div>
    </div>
  );
};

export default Profile;
