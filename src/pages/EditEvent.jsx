import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const EditEvent = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    location: "",  // 🔹 Added Location Field
  });

  useEffect(() => {
    // Fetch event data to pre-fill the form
    const fetchEvent = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/v1/events/${eventId}`);
        if (response.data.success) {
            console.log("Fetched Event:", response.data.event); // Debugging log
          setFormData({
            title: response.data.event.title,
            description: response.data.event.description,
            date: response.data.event.date.split("T")[0],
            location: response.data.event.location,  // 🔹 Populate Location
          });
        }
      } catch (error) {
        console.error("Error fetching event:", error);
      }
    };

    fetchEvent();
  }, [eventId]);

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Update event function
  const handleUpdateEvent = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      console.log("Sending Data:", formData); // Debugging log

      const response = await axios.put(
        `https://event-management-system-backend-sf2n.onrender.com/api/v1/events/${eventId}`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("Response:", response.data); // Debugging log
      // alert("Event updated successfully!");
      toast.success("Event updated successfully!");
      navigate("/");
    } catch (error) {
      console.error("Error updating event:", error.response?.data || error.message);
      // alert("Failed to update event.");
      toast.error("Failed to update event.");
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center">Edit Event</h2>
      <form onSubmit={handleUpdateEvent} className="p-4 shadow-lg bg-white rounded">
        <div className="mb-3">
          <label className="form-label">Title:</label>
          <input type="text" className="form-control" name="title" value={formData.title} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Description:</label>
          <textarea className="form-control" name="description" value={formData.description} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Date:</label>
          <input type="date" className="form-control" name="date" value={formData.date} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Location:</label>
          <input type="text" className="form-control" name="location" value={formData.location} onChange={handleChange} required />
        </div>
        <button className="btn btn-success w-100" type="submit">Update Event</button>
      </form>
    </div>
  );
};

export  {EditEvent};
