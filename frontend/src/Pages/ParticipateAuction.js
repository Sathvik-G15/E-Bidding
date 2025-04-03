import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import styles from "../CSS/ParticipateAuction.module.css";
import { AuthContext } from "../Context/AuthContext"; // Import AuthContext

const ParticipateAuction = () => {
  const [ongoingAuctions, setOngoingAuctions] = useState([]);
  const [upcomingAuctions, setUpcomingAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext); // Get logged-in user

  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/auctions`);
        const auctions = response.data;
        const now = new Date();

        // Check if user is available before filtering
        const filteredAuctions = user
          ? auctions.filter((auction) => auction.seller._id !== user.id)
          : auctions;


        // Separate ongoing and upcoming auctions
        const ongoing = filteredAuctions.filter(
          (auction) => new Date(auction.startTime) <= now && new Date(auction.endTime) > now
        );

        const upcoming = filteredAuctions.filter((auction) => new Date(auction.startTime) > now);

        setOngoingAuctions(ongoing);
        setUpcomingAuctions(upcoming);
      } catch (error) {
        console.error("Error fetching auctions:", error);
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchAuctions();
  }, [user]);

  if (loading) {
    return <p className={styles.loadingText}>Loading auctions...</p>;
  }

  return (
    <div className={styles.auctionContainer}>
      <h1>Participate in Auctions</h1>

      {/* Ongoing Auctions */}
      <h2 className={styles.sectionHeading}>Ongoing Auctions</h2>
      {ongoingAuctions.length === 0 ? (
        <p className={styles.noAuctionText}>No ongoing auctions available.</p>
      ) : (
        <div className={styles.auctionsGrid}>
          {ongoingAuctions.map((auction) => (
            <div key={auction._id} className={styles.auctionCard}>
              <img src={auction.image} alt={auction.title} className={styles.auctionImage} />
              <h2>{auction.title}</h2>
              <p>{auction.description}</p>
              <p><strong>Current Bid:</strong> ${auction.currentBid || "No bids yet"}</p>
              <p><strong>Ends At:</strong> {new Date(auction.endTime).toLocaleString()}</p>
              <Link to={`/auction/${auction._id}/bid`} className={styles.participateBtn}>
                Participate
              </Link>
            </div>
          ))}
        </div>
      )}

      {/* Upcoming Auctions */}
      <h2 className={styles.sectionHeading}>Upcoming Auctions</h2>
      {upcomingAuctions.length === 0 ? (
        <p className={styles.noAuctionText}>No upcoming auctions available.</p>
      ) : (
        <div className={styles.auctionsGrid}>
          {upcomingAuctions.map((auction) => (
            <div key={auction._id} className={styles.auctionCard}>
              <img src={auction.image} alt={auction.title} className={styles.auctionImage} />
              <h2>{auction.title}</h2>
              <p>{auction.description}</p>
              <p><strong>Starting Bid:</strong> ${auction.startingBid}</p>
              <p><strong>Starts At:</strong> {new Date(auction.startTime).toLocaleString()}</p>
              <p><strong>Ends At:</strong> {new Date(auction.endTime).toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ParticipateAuction;
