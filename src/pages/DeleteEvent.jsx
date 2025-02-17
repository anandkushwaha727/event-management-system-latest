import { toast } from "react-toastify";

const handleDeleteEvent = async (eventId) => {
    if (!user) {
      // alert("You must be logged in to delete an event!");
      toast.error("You must be logged in to delete an event!");
      navigate("/login");
      return;
    }

    const confirmDelete = window.confirm("Are you sure you want to delete this event?");
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(`https://event-management-system-backend-sf2n.onrender.com/api/v1/events/${eventId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        // alert("Event deleted successfully!");
        toast.success("Event deleted successfully!");
        setEvents(events.filter((event) => event._id !== eventId)); // Remove from UI
      } else {
        // alert(response.data.message);
        toast.error(response.data.message);
      }
    } catch (error) {
      // alert("Failed to delete event. You might not have permission.");
      toast.error("Failed to delete event. You might not have permission.");
    }
};

return (
    <div>
        {events.map((event) => (
            <div key={event._id}>
                <h3>{event.title}</h3>
                <p>{event.description}</p>

                {/* Show delete button only for event creator */}
                {user && user._id === event.createdBy && (
                    <button onClick={() => handleDeleteEvent(event._id)}>Delete</button>
                )}
            </div>
        ))}
    </div>
);
