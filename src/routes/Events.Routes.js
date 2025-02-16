import express from "express";
import { createEvent } from "../controllers/event.Controller.js";
import { upload } from "../middleware/multer.middleware.js"; 
import { authenticateUser } from "../middleware/auth.middleware.js"; 
import { getAllEvents } from "../controllers/event.Controller.js";
import { getSingleEvent } from "../controllers/event.Controller.js";
import { updateEvent } from "../controllers/event.Controller.js";
import { deleteEvent } from "../controllers/event.Controller.js";

const router = express.Router();

router.post("/create", authenticateUser, upload.single("image"), createEvent);

router.get("/", getAllEvents);
router.get("/:id", getSingleEvent);
router.put("/:id", authenticateUser, updateEvent); // Update event
router.delete("/:id", authenticateUser, deleteEvent);


export default router;
