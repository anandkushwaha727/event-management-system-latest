import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import  Signup  from "./pages/signup.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import CreateEvent from "./pages/CreateEvent.jsx";
import {EditEvent} from "./pages/EditEvent.jsx";
import Navbar from "./components/Navbar.jsx";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function App() {
  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <Router>
      <Navbar />
        <Routes>
          <Route path="/" element={<Dashboard />} />  {/* ✅ Always Accessible */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/create-event" element={<CreateEvent />} />
          <Route path="/edit-event/:eventId" element={<EditEvent />} />
          {/* 🔐 Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/protected-page" element={<ProtectedRoute />} />
          </Route>
        </Routes>
      </Router>
    </>
  );
}


export default App;
