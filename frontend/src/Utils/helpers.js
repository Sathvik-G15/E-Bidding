// Format price to USD currency
import {jwtDecode} from "jwt-decode";
export const formatPrice = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };
  
  // Convert timestamp to readable date format
  export const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" });
  };
  
  // Calculate remaining auction time
  export const getTimeRemaining = (endTime) => {
    const total = new Date(endTime) - new Date();
    if (total <= 0) return "Auction Ended";
  
    const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((total / (1000 * 60)) % 60);
    const seconds = Math.floor((total / 1000) % 60);
  
    return `${hours}h ${minutes}m ${seconds}s`;
  };
  
  // Validate email format
  export const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };
  
  // Validate password strength
  export const isStrongPassword = (password) => {
    return password.length >= 6;
  };
  
  // Display success messages
  export const showSuccessMessage = (message) => {
    alert(`✅ ${message}`);
  };
  
  // Display error messages
  export const showErrorMessage = (message) => {
    alert(`❌ ${message}`);
  };
  
  

// Extract user details from JWT token
export const getUserFromToken = (token) => {
  try {
    return jwtDecode(token); // Decode token to get user details
  } catch (error) {
    console.error("Invalid token", error);
    return null;
  }
};
