import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import BidForm from "../Components/BidForm"; // Import the BidForm component
import styles from "../CSS/AuctionDetails.module.css";


const AuctionBidPage = () => {
  const { auctionId } = useParams();
  const [auction, setAuction] = useState(null);

  const fetchAuction = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/auctions/${auctionId}`);
      setAuction(response.data);
    } catch (error) {
      console.error("Error fetching auction:", error);
    }
  };

  useEffect(() => {
    fetchAuction();

   
  }, [auctionId]);

  const placeBid = async (auctionId, bidAmount) => {
    try {
      const token = localStorage.getItem("Token");
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/auctions/${auctionId}/bid`,
        { bidAmount },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert(response.data.message);
      fetchAuction(); // ✅ Fetch updated auction details after bid
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
      <p><strong>Current Bid:</strong> ${auction.currentBid || "No bids yet"}</p>
      <p><strong>Ends At:</strong> {new Date(auction.endTime).toLocaleString()}</p>
      <BidForm auctionId={auction._id} placeBid={placeBid} />
    </div>
  );
};

export default AuctionBidPage;
