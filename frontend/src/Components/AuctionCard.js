// src/components/AuctionCard.js
const AuctionCard = ({ auction }) => {
    return (
      <div className="auction-card">
        <h3>{auction.title}</h3>
        <p>Current Bid: ${auction.currentBid}</p>
      </div>
    );
  };
  
  export default AuctionCard;
  