import React, { useEffect, useState } from "react";
import styles from "../CSS/AdminPanel.module.css";
import UsersList from "../Components/AdminPanel/UsersList";
import AuctionsList from "../Components/AdminPanel/AuctionsList";
import BidsList from "../Components/AdminPanel/BidsList";
import PaymentsList from "../Components/AdminPanel/PaymentsList";

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [auctions, setAuctions] = useState([]);
  const [bids, setBids] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const usersRes = await fetch("/api/admin/users");
      const auctionsRes = await fetch("/api/admin/auctions");
      const bidsRes = await fetch("/api/admin/bids");
      const paymentsRes = await fetch("/api/admin/payments");

      setUsers(await usersRes.json());
      setAuctions(await auctionsRes.json());
      setBids(await bidsRes.json());
      setPayments(await paymentsRes.json());
    } catch (error) {
      console.error("Error fetching admin data:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (userId) => {
    try {
      await fetch(`/api/admin/users/${userId}`, { method: "DELETE" });
      setUsers(users.filter((user) => user._id !== userId));
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const deleteAuction = async (auctionId) => {
    try {
      await fetch(`/api/admin/auctions/${auctionId}`, { method: "DELETE" });
      setAuctions(auctions.filter((auction) => auction._id !== auctionId));
    } catch (error) {
      console.error("Error deleting auction:", error);
    }
  };

  return (
    <div className={styles.adminContainer}>
      <h2 className={styles.adminDashboard}>Admin Dashboard</h2>

      {loading ? (
        <p>Loading data...</p>
      ) : (
        <>
          <UsersList users={users} deleteUser={deleteUser} />
          <AuctionsList auctions={auctions} deleteAuction={deleteAuction} />
          <BidsList bids={bids} />
          <PaymentsList payments={payments} />
        </>
      )}
    </div>
  );
};

export default AdminPanel;
