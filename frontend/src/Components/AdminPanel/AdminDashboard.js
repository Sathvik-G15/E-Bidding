import { useNavigate } from "react-router-dom";


const AdminDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="admin-dashboard">
      <h2>Admin Dashboard</h2>
      <div className="admin-sections">
        <button onClick={() => navigate("/admin/users")}>Manage Users</button>
        <button onClick={() => navigate("/admin/auctions")}>Manage Auctions</button>
        <button onClick={() => navigate("/admin/bids")}>Manage Bids</button>
        <button onClick={() => navigate("/admin/payments")}>Manage Payments</button>
      </div>
    </div>
  );
};

export default AdminDashboard;
