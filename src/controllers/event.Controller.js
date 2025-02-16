import { Event } from "../models/Event.models.js";
import {uploadcloudnary} from "../utils/cloudinary.js";
import {asyncHandler} from "../utils/AsycHandler.js";
import { io } from "../index.js"; 

export const createEvent = async (req, res) => {
    try {
      const { title, description, date, location } = req.body;
      const userId = req.user._id; // Get user from token (auth middleware)
  
      console.log("Received file:", req.file); // Debugging
      console.log("Request body:", req.body); // Debugging
  
      if (!title ) {
        return res.status(400).json({ success: false, message: "title fields are required!" });
      }
      if(!description){
        return res.status(400).json({ success: false, message: "description fields are required!" });
      }
        if(!date){
        return res.status(400).json({ success: false, message: "date fields are required!" });
        }
        if(!location){
        return res.status(400).json({ success: false, message: "location fields are required!" });
        }
        
  
      let imageUrl = null;
      if (req.file) {
        const cloudinaryResult = await uploadcloudnary(req.file.path);
        console.log("🌟 Cloudinary Upload Response:", cloudinaryResult); // Debugging
  
        if (cloudinaryResult && cloudinaryResult.secure_url) {
          imageUrl = cloudinaryResult.secure_url;
        } else {
          console.log("Cloudinary upload failed!");
          return res.status(500).json({ success: false, message: "Failed to upload image to Cloudinary" });
        }
      }
  
      // Validate date
      const eventDate = new Date(date);
      if (isNaN(eventDate.getTime())) {
        return res.status(400).json({ success: false, message: "Invalid date format" });
      }
  
      const event = new Event({
        title,
        description,
        date: eventDate,
        location,
        image: imageUrl,
        createdBy: userId,
      });
  
      await event.save();
      io.emit("eventCreated", event); // Emit eventCreated event to all clients
  
      return res.status(201).json({
        success: true,
        message: "Event created successfully!",
        event,
      });
  
    } catch (error) {
      console.error("Error creating event:", error);
      return res.status(500).json({
        success: false,
        message: "Error creating event",
        error: error.message,
      });
    }
  };
  

// Get all events
export const getAllEvents = asyncHandler(async (req, res) => {
  const events = await Event.find();
  
  if (!events || events.length === 0) {
      throw new ApiError(404, "No events found");
  }

  res.status(200).json({
      success: true,
      count: events.length,
      events
  });
});
// Get single event


export const getSingleEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ success: false, message: "Event not found" });
        }
        res.status(200).json({ success: true, event });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching event", error: error.message });
    }
};
// Update event
export const updateEvent = async (req, res) => {
  try {
    console.log("Received Event ID:", req.params.id);
    console.log("Updating with Data:", req.body);

    const { id } = req.params;
    const updatedEvent = await Event.findByIdAndUpdate(id, req.body, { new: true });

    if (!updatedEvent) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }

    res.json({ success: true, message: "Event updated successfully", event: updatedEvent });
  } catch (error) {
    console.error("Error updating event:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};




// ✅ Delete an Event
export const deleteEvent = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const event = await Event.findById(id);
    if (!event) return res.status(404).json({ success: false, message: "Event not found" });

    // Check if the user is the creator of the event
    if (event.createdBy.toString() !== req.user._id.toString()) {
        return res.status(403).json({ success: false, message: "Unauthorized to delete this event" });
    }

    await Event.findByIdAndDelete(id);
    io.emit("eventDeleted", { eventId: id });
    res.status(200).json({ success: true, message: "Event deleted successfully" });
});


