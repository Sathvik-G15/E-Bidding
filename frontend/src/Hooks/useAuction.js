// src/hooks/useAuction.js
import { useContext } from "react";
import { AuctionContext } from "../Context/AuctionContext";

const useAuction = () => {
  return useContext(AuctionContext);
};

export default useAuction;
