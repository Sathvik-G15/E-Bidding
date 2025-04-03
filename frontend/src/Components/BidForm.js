import { useState } from "react";

const BidForm = ({ auctionId, placeBid }) => {
  const [bidAmount, setBidAmount] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const bidValue = Number(bidAmount);
    if (!bidValue || bidValue <= 0) {
      setError("Enter a valid bid amount.");
      return;
    }

    try {
      await placeBid(auctionId, bidValue); // Ensure placeBid is async
      setBidAmount("");
      setError(""); // Clear error on success
    } catch (err) {
      setError(err.message || "Error placing bid.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="number"
        value={bidAmount}
        onChange={(e) => setBidAmount(e.target.value)}
        placeholder="Enter bid amount"
        min="1"
        required
      />
      <button type="submit">Place Bid</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
};

export default BidForm;
