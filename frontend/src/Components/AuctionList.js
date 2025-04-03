// src/components/AuctionList.js
import { useContext } from "react";
import { AuctionContext } from "../Context/AuctionContext";
import AuctionCard from "./AuctionCard";

const AuctionList = () => {
  const { auctions } = useContext(AuctionContext);

  return (
    <div className="auction-list">
      {auctions.map((auction) => (
        <AuctionCard key={auction._id} auction={auction} />
      ))}
    </div>
  );
};

export default AuctionList;
