import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./EventCard.css"; // Import custom styles

const EventCard = ({ event }) => {
  return (
    <div className="col-12 col-md-6 col-lg-4 mb-4"> {/* ✅ Responsive Grid Layout */}
      <div className="card shadow-sm h-100">
        {/* Event Image */}
        {event.image ? (
          <img
            src={event.image}
            className="card-img-top"
            alt={event.title}
          />
        ) : (
          <div className="text-center p-3 text-danger">❌ Image Not Available</div>
        )}

        {/* Card Body */}
        <div className="card-body d-flex flex-column">
          <h5 className="card-title">{event.title}</h5>
          <p className="card-text">{event.description}</p>
          <p className="text-muted">
            📅 {new Date(event.date).toLocaleDateString()} | 📍 {event.location}
          </p>
          <button className="btn btn-primary mt-auto w-100">View Details</button>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
