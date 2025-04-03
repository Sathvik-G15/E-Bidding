import { createContext, useState } from "react";


export const AuctionContext = createContext();

export const AuctionProvider = ({ children }) => {
  const [auctions, setAuctions] = useState([]);

 

  return (
    <AuctionContext.Provider value={{ auctions, setAuctions }}>
      {children}
    </AuctionContext.Provider>
  );
};
