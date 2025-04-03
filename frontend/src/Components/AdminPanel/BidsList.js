import { useState, useEffect } from "react";
import axios from "axios";

const BidsList = () => {
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBids = async () => {
      try {
        const { data } = await axios.get("/api/admin/bids");
        setBids(data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch bids");
      } finally {
        setLoading(false);
      }
    };

    fetchBids();
  }, []);

  return (
    <div className="admin-container">
      <h2>Bids</h2>

      {loading && <p>Loading bids...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && bids.length === 0 && <p>No bids available.</p>}

      {!loading && bids.length > 0 && (
        <table>
          <thead>
            <tr><th>Amount</th><th>Bidder</th><th>Auction</th></tr>
          </thead>
          <tbody>
            {bids.map((bid) => (
              <tr key={bid._id}>
                <td>${bid.amount}</td>
                <td>{bid.user?.name || "Unknown"}</td>
                <td>{bid.auction?.title || "Unknown"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default BidsList;
