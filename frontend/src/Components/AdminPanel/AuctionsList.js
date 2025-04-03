import { useState, useEffect } from "react";
import axios from "axios";
import "../../CSS/AuctionsList.module.css"; // Import the updated CSS
import { useNavigate } from "react-router-dom";

const AuctionsList = () => {
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/admin/auctions`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setAuctions(data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch auctions");
      } finally {
        setLoading(false);
      }
    };

    fetchAuctions();
  }, []);

  const deleteAuction = async (id) => {
    if (!window.confirm("Are you sure you want to delete this auction?")) return;

    try {
      const token = localStorage.getItem("adminToken");
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/admin/auctions/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setAuctions((prevAuctions) => prevAuctions.filter((auction) => auction._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete auction");
    }
  };

  const canDeleteAuction = (auction) => {
    const now = new Date();
    return new Date(auction.endTime) > now;
  };

  return (
    <div className="admin-container">
      <h2>All Auctions</h2>

      {loading && <p>Loading auctions...</p>}
      {error && <p className="error-message">{error}</p>}

      {!loading && auctions.length === 0 && <p className="no-auctions">No auctions available.</p>}

      {!loading && auctions.length > 0 && (
        <div className="table-container">
          <table className="styled-table">
            <thead>
              <tr>
                <th style={{ padding: '15px', boxSizing: 'border-box' }}>Title</th>
                <th style={{ padding: '15px', boxSizing: 'border-box' }}> Seller Name</th>
                <th style={{ padding: '15px', boxSizing: 'border-box' }}>Seller Email</th>
                <th style={{ padding: '15px', boxSizing: 'border-box' }}>Seller Contact</th>
                <th style={{ padding: '15px', boxSizing: 'border-box' }}>Start Date</th>
                <th style={{ padding: '15px', boxSizing: 'border-box' }}>End Date</th>
                <th style={{ padding: '15px', boxSizing: 'border-box' }}>Starting Bid</th>
                <th style={{ padding: '15px', boxSizing: 'border-box' }}>Highest Bid</th>
                <th style={{ padding: '15px', boxSizing: 'border-box' }}>View Details</th> {/* Separate column for View Details */}
                <th style={{ padding: '15px', boxSizing: 'border-box' }}>Delete</th> {/* Separate column for Delete */}
              </tr>
            </thead>
            <tbody>
              {auctions.map((auction) => (
                <tr key={auction._id}>
                  <td style={{ padding: '15px', boxSizing: 'border-box' }}>{auction.title}</td>
                  <td style={{ padding: '15px', boxSizing: 'border-box' }}>{auction.seller?.name || "N/A"}</td>
                  <td style={{ padding: '15px', boxSizing: 'border-box' }}>{auction.seller?.email || "N/A"}</td>
                  <td style={{ padding: '15px', boxSizing: 'border-box' }}>{auction.seller?.contact || "N/A"}</td>
                  <td style={{ padding: '15px', boxSizing: 'border-box' }}>{new Date(auction.startTime).toLocaleString()}</td>
                  <td style={{ padding: '15px', boxSizing: 'border-box' }}>{new Date(auction.endTime).toLocaleString()}</td>
                  <td style={{ padding: '15px', boxSizing: 'border-box' }}>${auction.startingBid}</td>
                  <td style={{ padding: '15px', boxSizing: 'border-box' }}>${auction.highestBid}</td>
                  <td className="view-details">
                    <button className="view-btn" onClick={() => navigate(`/auction/${auction._id}`)}>
                      View Bids
                    </button>
                  </td>
                  <td className="delete-button">
                    {canDeleteAuction(auction) && (
                      <button className="delete-btn" onClick={() => deleteAuction(auction._id)}>
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AuctionsList;
