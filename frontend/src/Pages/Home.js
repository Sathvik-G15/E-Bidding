import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import styles from "../CSS/Home.module.css";

const Home = () => {
  const [ongoingAuctions, setOngoingAuctions] = useState([]);
  const [upcomingAuctions, setUpcomingAuctions] = useState([]);

  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/auctions`);
        const currentTime = new Date();

        const ongoing = response.data.filter(
          (auction) => new Date(auction.startTime) <= currentTime && new Date(auction.endTime) > currentTime
        );

        const upcoming = response.data.filter(
          (auction) => new Date(auction.startTime) > currentTime
        );

        setOngoingAuctions(ongoing);
        setUpcomingAuctions(upcoming);
      } catch (error) {
        console.error("Error fetching auctions:", error);
      }
    };

    fetchAuctions();
  }, []);

  return (
    <div className={styles.homeContainer}>
      <h1 className={styles.homeTitle}>Welcome to E-Bidding</h1>
      
      <div className={styles.auctionsSection}>
        {/* Ongoing Auctions */}
        <div className={styles.auctionsColumn}>
          <h2 className={styles.sectionTitle}>Ongoing Auctions</h2>
          {ongoingAuctions.length === 0 ? (
            <p className={styles.noAuctions}>No ongoing auctions available.</p>
          ) : (
            ongoingAuctions.map((auction) => (
              <div key={auction._id} className={styles.auctionCard}>
                <img src={auction.image} alt={auction.title} className={styles.auctionImage} />
                <h3>{auction.title}</h3>
                <p>{auction.description}</p>
                <p><strong>Current Bid:</strong> ${auction.highestBid || "No bids yet"}</p>
                <p><strong>Ends At:</strong> {new Date(auction.endTime).toLocaleString()}</p>
                <Link to={"/login"} className={styles.participateBtn}>
                  Participate
                </Link>
              </div>
            ))
          )}
        </div>

        {/* Upcoming Auctions */}
        <div className={styles.auctionsColumn}>
          <h2 className={styles.sectionTitle}>Upcoming Auctions</h2>
          {upcomingAuctions.length === 0 ? (
            <p className={styles.noAuctions}>No upcoming auctions available.</p>
          ) : (
            upcomingAuctions.map((auction) => (
              <div key={auction._id} className={styles.auctionCard}>
                <img src={auction.image} alt={auction.title} className={styles.auctionImage} />
                <h3>{auction.title}</h3>
                <p>{auction.description}</p>
                <p><strong>Starting At:</strong> {new Date(auction.startTime).toLocaleString()}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
