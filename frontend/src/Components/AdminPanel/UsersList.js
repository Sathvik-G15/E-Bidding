import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import axios from "axios";
import styles from "../../CSS/UsersList.module.css"; // Ensure you have a CSS file for styling

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Initialize navigation

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        if (!token) {
          throw new Error("No token found, please login again.");
        }

        const { data } = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/admin/users`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setUsers(data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const deleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      const token = localStorage.getItem("adminToken");
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(users.filter((user) => user._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete user");
    }
  };

  const toggleRole = async (id, currentRole) => {
    const newRole = currentRole === "admin" ? "user" : "admin"; // Toggle role
    const confirmMessage =
      currentRole === "admin"
        ? "Are you sure you want to revoke admin access?"
        : "Are you sure you want to make this user an admin?";

    if (!window.confirm(confirmMessage)) return;

    try {
      const token = localStorage.getItem("adminToken");

      await axios.put(
        `${process.env.REACT_APP_API_URL}/api/admin/users/${id}`,
        { role: newRole }, // Send the toggled role
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update state to reflect the role change
      setUsers(users.map((user) => (user._id === id ? { ...user, role: newRole } : user)));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update user role");
    }
  };

  const goToProfile = (id) => {
    navigate(`/users/${id}`); // Navigate to user profile
  };

  return (
    <div className={styles.adminContainer}>
      <h2 className={styles.title}>Users List</h2>

      {loading && <p className={styles.message}>Loading users...</p>}
      {error && <p className={styles.error}>{error}</p>}

      {!loading && users.length === 0 && <p className={styles.message}>No users found.</p>}

      {!loading && users.length > 0 && (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td className={user.role === "admin" ? styles.adminRole : ""}>{user.role}</td>
                <td className={styles.actionsContainer}>
                  <button className={styles.detailsBtn} onClick={() => goToProfile(user._id)}>
                    ℹ️ Details
                  </button>
                  <button
                    className={styles.adminBtn}
                    onClick={() => toggleRole(user._id, user.role)}
                  >
                    {user.role === "admin" ? "🔽 Revoke Admin" : "🎖️ Make Admin"}
                  </button>
                  <button className={styles.deleteBtn} onClick={() => deleteUser(user._id)}>
                    ❌ Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UsersList;
