import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify"; 
const CreateEvent = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [image, setImage] = useState(null);
  const navigate = useNavigate();

  const handleCreateEvent = async (e) => {
    e.preventDefault();

    if (!title || !description || !date || !location || !image) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      const token = localStorage.getItem("token"); // Get auth token

      // Create FormData to send file + event data to backend
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("date", date);
      formData.append("location", location);
      formData.append("image", image); // Image file

      // Send data to backend API (Express)
      const response = await axios.post(
        "https://event-management-system-backend-sf2n.onrender.com/api/v1/events/create",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data", // Ensure correct format
          },
        }
      );

      if (response.data.success) {
        // console.log("Event created:", response.data.event);
        // console.log(response.data.event.image)
        // alert("Event created successfully!");
        toast.success("Event created successfully!");
        navigate("/");
      }
    } catch (error) {
      // alert("Failed to create event.");
      console.error(error);
      toast.error("Failed to create event.");
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center">Create Event</h2>
      <form onSubmit={handleCreateEvent} className="p-4 shadow-lg bg-white rounded">
        <div className="mb-3">
          <label className="form-label">Title:</label>
          <input type="text" className="form-control" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Description:</label>
          <textarea className="form-control" value={description} onChange={(e) => setDescription(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Date:</label>
          <input type="date" className="form-control" value={date} onChange={(e) => setDate(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Location:</label>
          <input type="text" className="form-control" value={location} onChange={(e) => setLocation(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Image:</label>
          <input type="file" className="form-control" onChange={(e) => setImage(e.target.files[0])} required />
        </div>
        <button className="btn btn-primary w-100" type="submit">Create Event</button>
      </form>
    </div>
  );
};

export default CreateEvent;
