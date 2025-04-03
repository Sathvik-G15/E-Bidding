import { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "../CSS/Dashboard.module.css";
import { AuthContext } from "../Context/AuthContext"; // Ensure authentication

const Dashboard = () => {
  const [ongoingAuctions, setOngoingAuctions] = useState([]);
  const [upcomingAuctions, setUpcomingAuctions] = useState([]);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyAuctions = async () => {
      try {
        const token = localStorage.getItem("Token");
        if (!token) {
          console.error("No token found, user might be logged out.");
          return;
        }

        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/auctions/my-auctions`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (!response.data || response.data.length === 0) {
          console.warn("No auctions found for this user.");
        }

        const currentTime = new Date();

        // Separate ongoing and upcoming auctions
        const ongoing = response.data.filter(
          (auction) => new Date(auction.startTime) <= currentTime && new Date(auction.endTime) > currentTime
        );

        const upcoming = response.data.filter(
          (auction) => new Date(auction.startTime) > currentTime
        );

        setOngoingAuctions(ongoing);
        setUpcomingAuctions(upcoming);
      } catch (error) {
        console.error("Error fetching user auctions:", error.response?.data || error.message);
      }
    };

    fetchMyAuctions();
  }, []);

  const handleCreateAuction = () => {
    navigate("/create-auction");
  };

  return (
    <div className={styles.dashboardContainer}>
      <h1>My Auctions</h1>
      <button className={styles.createAuctionBtn} onClick={handleCreateAuction}>
        + Create Auction
      </button>

      <div className={styles.auctionsSection}>
        {/* Ongoing Auctions */}
        <div className={styles.auctionsColumn}>
          <h2 className={styles.sectionTitle}>Ongoing Auctions</h2>
          {ongoingAuctions.length === 0 ? (
            <p className={styles.noAuctionText}>No ongoing auctions available.</p>
          ) : (
            ongoingAuctions.map((auction) => {
              return (
                <div key={auction._id} className={styles.auctionCard}>
                  <img 
                    src={auction.image || "https://via.placeholder.com/150"} 
                    alt={auction.title} 
                    className={styles.auctionImage} 
                  />
                  <h3>{auction.title}</h3>
                  <p><strong>Starting Bid:</strong> ${auction.startingBid}</p>
                  <p><strong>Current Bid:</strong> ${auction.highestBid || "No bids yet"}</p>
                  <p><strong>Ends At:</strong> {new Date(auction.endTime).toLocaleString()}</p>
                  <Link to={`/auction/${auction._id}`} className={styles.viewDetails}>
                    View Details
                  </Link>
                </div>
              );
            })
          )}
        </div>

        {/* Upcoming Auctions */}
        <div className={styles.auctionsColumn}>
          <h2 className={styles.sectionTitle}>Upcoming Auctions</h2>
          {upcomingAuctions.length === 0 ? (
            <p className={styles.noAuctionText}>No upcoming auctions available.</p>
          ) : (
            upcomingAuctions.map((auction) => {
              return (
                <div key={auction._id} className={styles.auctionCard}>
                  <img 
                    src={auction.image || "https://via.placeholder.com/150"} 
                    alt={auction.title} 
                    className={styles.auctionImage} 
                  />
                  <h3>{auction.title}</h3>
                  <p><strong>Starting Bid:</strong> ${auction.startingBid}</p>
                  <p><strong>Starts At:</strong> {new Date(auction.startTime).toLocaleString()}</p>
                  <Link to={`/auction/${auction._id}`} className={styles.viewDetails}>
                    View Details
                  </Link>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
