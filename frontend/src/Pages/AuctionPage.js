import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import styles from "../CSS/AuctionPage.module.css";

const AuctionPage = () => {
  const { id } = useParams();
  const [auction, setAuction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAuction = async () => {
      try {
        console.log("Fetching auction with ID:", id);
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/auctions/${id}`
        );
        console.log("Auction Data:", response.data); // ✅ Check if startingPrice exists
        setAuction(response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Error fetching auction details");
      } finally {
        setLoading(false);
      }
    };

    fetchAuction();
  }, [id]);

  useEffect(() => {
    console.log("Auction Data Updated:", auction);
  }, [auction]);

  if (loading) return <p>Loading auction details...</p>;
  if (error) return <p className={styles.error}>{error}</p>;

  const highestBid = auction?.bids?.length > 0
    ? Math.max(...auction.bids.map(bid => bid.amount))
    : auction?.startingPrice;

  return (
    <div className={styles.auctionContainer}>
      <h1>{auction?.title ?? "Untitled Auction"}</h1>
      <p><strong>Description:</strong> {auction?.description ?? "No description available"}</p>
      <p><strong>Starting Price:</strong> ${auction?.startingBid ?? "N/A"}</p>
      <p><strong>Current Highest Bid:</strong> ${highestBid ?? "N/A"}</p>
      <p><strong>Auction Ends On:</strong> {auction?.endTime ? new Date(auction.endTime).toLocaleString() : "Unknown"}</p>

      <h2>Bidding History</h2>
      {auction?.bids?.length > 0 ? (
        <ul className={styles.bidsList}>
          {auction.bids.map((bid) => (
            <li key={bid._id}>
              <p><strong>Bidder:</strong> {bid.user?.name || "Unknown"}</p>
              <p><strong>Amount:</strong> ${bid.amount}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No bids placed yet.</p>
      )}
    </div>
  );
};

export default AuctionPage;
