import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { io } from "socket.io-client"; // 🔹 Import WebSocket
import EventCard from "../components/EventCard.jsx";
import { toast } from "react-toastify";
import "../App.css";


const Dashboard = () => {
  const [events, setEvents] = useState([]);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch all events
    const fetchEvents = async () => {
      try {
        const response = await axios.get("https://event-management-system-backend-sf2n.onrender.com/api/v1/events");
        if (response.data.success) {
          setEvents(response.data.events);
        }
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();

    // Get user from localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    // 🔹 Setup WebSocket Connection
    const socket = io("https://event-management-system-backend-sf2n.onrender.com");

    // 🔹 Listen for New Event Creation
    socket.on("eventCreated", (newEvent) => {
      console.log("🆕 New event received via WebSocket:", newEvent);
      setEvents((prevEvents) => [...prevEvents, newEvent]); // Append new event
    });

    // 🔹 Listen for Event Deletion
    socket.on("eventDeleted", ({ eventId }) => {
      console.log("🗑️ Event deleted via WebSocket:", eventId);
      setEvents((prevEvents) => prevEvents.filter((event) => event._id !== eventId)); // Remove event
    });

    return () => {
      socket.disconnect(); // Cleanup WebSocket on unmount
    };
  }, []);

  // Logout Function
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
   toast.error("Logged out successfully");
    navigate("/");
  };

  // Guest Redirect for Event Actions
  const ensureAuthenticated = (action, eventId = null) => {
    if (!user) {
      alert(`You must be logged in to ${action} an event!`);
      navigate("/login");
      return false;
    }
    return true;
  };

  // Create Event Handler
  const handleCreateEvent = () => {
    if (ensureAuthenticated("create")) {
      navigate("/create-event");
    }
  };

  // Edit Event Handler
  const handleEditEvent = (eventId) => {
    if (ensureAuthenticated("edit", eventId)) {
      navigate(`/edit-event/${eventId}`);
    }
  };

  // Delete Event Handler
  const handleDeleteEvent = async (eventId) => {
    if (!ensureAuthenticated("delete", eventId)) return;

    if (!window.confirm("Are you sure you want to delete this event?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`https://event-management-system-backend-sf2n.onrender.com/api/v1/events/${eventId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Event deleted successfully!");
    } catch (error) {
      alert("Failed to delete event. You might not have permission.");
    }
  };

  return (
    <div className="container">
      <h1>Event Dashboard</h1>

      {/* 🔹 Welcome Message */}
      {user ? <p>Welcome, {user.fullName}!</p> : <p>You are browsing as a guest.</p>}

      {/* 🔹 Authentication Buttons */}
      {!user ? (
        <div>
          <Link to="/login"><button>Login</button></Link>
          <Link to="/signup"><button>Sign Up</button></Link>
        </div>
      ) : (
        <button onClick={handleLogout}>Logout</button>
      )}

      {/* 🔹 Create Event Button */}
      {user && <button onClick={handleCreateEvent}>Create Event</button>}

      <h2>Available Events</h2>
      {events.length > 0 ? (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {events.map((event) => (
        <div key={event._id} className="relative border p-4 rounded shadow-md">
          <EventCard event={event} />
    
          {/* ✅ Edit & Delete Buttons (Only if user is the event creator) */}
          {user && user._id === event.createdBy && (
            <div className="mt-2">
            <button
              onClick={() => handleEditEvent(event._id)}
              className="btn btn-primary me-2"
            >
              Edit
            </button>
            <button
              onClick={() => handleDeleteEvent(event._id)}
              className="btn btn-danger"
            >
              Delete
            </button>
          </div>
          
          )}
        </div>
      ))}
    </div>
    
      ) : (
        <p>No events available.</p>
      )}
    </div>
  );
};

export default Dashboard;
