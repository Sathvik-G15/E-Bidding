import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import io from "socket.io-client"; // WebSocket for real-time updates
import styles from "../CSS/AuctionDetails.module.css";

const socket = io(process.env.REACT_APP_SOCKET_URL); // WebSocket connection

const AuctionDetails = () => {
  const { id } = useParams(); // Extract auction ID from URL
  const [auction, setAuction] = useState(null);
  const [bidAmount, setBidAmount] = useState("");

  // Fetch auction details
  const fetchAuction = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/auctions/${id}`);
      setAuction(response.data);
    } catch (error) {
      console.error("Error fetching auction:", error);
    }
  };

  useEffect(() => {
    fetchAuction();
  
    // ✅ Listen for real-time bid updates
    const handleAuctionUpdate = (updatedAuction) => {
      if (updatedAuction._id === id) {
        setAuction((prev) => ({
          ...prev,
          ...updatedAuction, // Update all auction details
        }));
      }
    };
  
    socket.on("auctionUpdated", handleAuctionUpdate);
  
    return () => socket.off("auctionUpdated", handleAuctionUpdate); // Cleanup socket listener
  }, [id]);

  // Handle placing a bid
  const handlePlaceBid = async () => {
    const parsedBid = parseFloat(bidAmount);
    
    if (!bidAmount || parsedBid <= auction.currentBid) {
      alert("Your bid must be higher than the current bid.");
      return;
    }
 
    try {
      const token = localStorage.getItem("Token");
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/auctions/${id}/bid`,
        { bidAmount: parsedBid },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert(response.data.message);

      // ✅ Update UI immediately
      setAuction((prev) => ({
        ...prev,
        currentBid: parsedBid,
        bids: [{ user: { name: "You" }, amount: parsedBid, timestamp: new Date() }, ...prev.bids], // Add new bid to list
      }));

      setBidAmount(""); // Clear input field
    } catch (error) {
      console.error("Error placing bid:", error);
      alert(error.response?.data?.message || "Error placing bid.");
    }
  };

  if (!auction) return <p>Loading...</p>;

  return (
    <div className={styles.auctionDetails}>
      <h1>{auction.title}</h1>
      <p>{auction.description}</p>
      <p><strong>Current Bid:</strong> ${auction.currentBid}</p>
      <p><strong>Ends At:</strong> {new Date(auction.endTime).toLocaleString()}</p>

      {/* ✅ Bid Input and Button */}
      <div className={styles.bidSection}>
        <input
          type="number"
          value={bidAmount}
          onChange={(e) => setBidAmount(e.target.value)}
          placeholder="Enter your bid"
        />
        <button onClick={handlePlaceBid}>Place Bid</button>
      </div>

      {/* ✅ Display Bids */}
      <h2>Bidding History</h2>
      {auction.bids.length > 0 ? (
        <ul className={styles.bidsList}>
          {auction.bids.map((bid, index) => (
            <li key={index} className={styles.bidItem}>
              <p><strong>User:</strong> {bid.user?.name || "Anonymous"}</p>
              <p><strong>Amount:</strong> ${bid.amount}</p>
              <p><strong>Time:</strong> {new Date(bid.timestamp).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No bids placed yet.</p>
      )}
    </div>
  );
};

export default AuctionDetails;
