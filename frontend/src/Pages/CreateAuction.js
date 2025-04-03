import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "../CSS/CreateAuction.module.css";
import { AuthContext } from "../Context/AuthContext"; // Ensure authentication

const CreateAuction = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startingBid, setStartingBid] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");
  const { user } = useContext(AuthContext); // Get logged-in user
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file)); // Show preview of selected image
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors

    if (!title || !description || !startingBid || !startTime || !endTime || !image) {
      setError("All fields are required!");
      return;
    }

    if (new Date(startTime) >= new Date(endTime)) {
      setError("Start time must be before end time!");
      return;
    }

    try {
      const token = localStorage.getItem("Token"); // Get auth token

      // Upload image to Cloudinary
      const formData = new FormData();
      formData.append("file", image);
      formData.append("upload_preset", "Bid_Item"); // Replace with your Cloudinary upload preset
      formData.append("cloud_name", "dhnyya6wx");
      
      const cloudinaryRes = await axios.post(
        "https://api.cloudinary.com/v1_1/dhnyya6wx/image/upload",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      // Get image URL from Cloudinary response
      const imageUrl = cloudinaryRes.data.secure_url;

      // Send auction data to backend
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/auctions/create`,
        { title, description, startingBid, startTime, endTime, image: imageUrl },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 201) {
        alert("Auction created successfully!");
        navigate("/dashboard"); // Redirect to dashboard
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create auction.");
    }
  };

  return (
    <div className={styles.createAuctionContainer}>
      <h1>Create Auction</h1>
      {error && <p className={styles.error}>{error}</p>}
      <form className={styles.createAuctionForm} onSubmit={handleSubmit}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Auction Title"
          required
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Auction Description"
          required
        />
        <input
          type="number"
          value={startingBid}
          onChange={(e) => setStartingBid(e.target.value)}
          placeholder="Starting Bid ($)"
          required
        />
        <label>Start Time</label>
        <input
          type="datetime-local"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          required
        />
        <label>End Time</label>
        <input
          type="datetime-local"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          required
        />
        <input type="file" accept="image/*" onChange={handleImageChange} required />
        {preview && <img src={preview} alt="Auction Preview" className={styles.previewImage} />}
        <button type="submit">Create Auction</button>
      </form>
    </div>
  );
};

export default CreateAuction;
