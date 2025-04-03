import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Dashboard from "./Pages/Dashboard";
import AuctionPage from "./Pages/AuctionPage";
import Profile from "./Pages/Profile";
import CreateAuction from "./Pages/CreateAuction";
import ParticipateAuction from "./Pages/ParticipateAuction";
import AuctionBidPage from "./Pages/AuctionBidPage";
import { AuthProvider } from "./Context/AuthContext";
import { AuctionProvider } from "./Context/AuctionContext";
import AdminLogin from "./Pages/AdminLogin";
import UsersList from "./Components/AdminPanel/UsersList";
import AuctionsList from "./Components/AdminPanel/AuctionsList";
import BidsList from "./Components/AdminPanel/BidsList";
import ProtectedRoute from "./Components/ProtectedRoute"; // User authentication
import AdminRoute from "./Components/AdminRoute"; // Admin authentication

function App() {
  return (
    <Router>
      <AuthProvider>
        <AuctionProvider>
          <Navbar />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/users/:id" element={<Profile />} />
            {/* Protected User Routes */}
            <Route
              path="/dashboard"
              element={<ProtectedRoute element={<Dashboard />} />}
            />
            <Route
              path="/profile"
              element={<ProtectedRoute element={<Profile />} />}
            />
            <Route
              path="/create-auction"
              element={<ProtectedRoute element={<CreateAuction />} />}
            />
            <Route path="/auction/:id" element={<AuctionPage />} />
            <Route
              path="/participate-auction"
              element={<ProtectedRoute element={<ParticipateAuction />} />}
            />
            <Route
              path="/auction/:auctionId/bid"
              element={<ProtectedRoute element={<AuctionBidPage />} />}
            />

            {/* Admin Protected Routes */}
            <Route
              path="/admin"
              element={<AdminRoute element={<AdminLogin />} />}
            />
            <Route
              path="/admin/users"
              element={<UsersList />} 
            />
            <Route
              path="/admin/auctions"
              element={<AdminRoute element={<AuctionsList />} />}
            />
            <Route
              path="/admin/bids"
              element={<AdminRoute element={<BidsList />} />}
            />
           
          </Routes>
          <Footer />
        </AuctionProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
