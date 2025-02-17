import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("https://event-management-system-backend-sf2n.onrender.com/api/v1/users/login", formData);
      
      console.log("Login Response:", res.data); // Debugging: Check what is returned


      // Store JWT Token and user data
      localStorage.setItem("token", res.data.data.accessToken); 
      localStorage.setItem("user", JSON.stringify(res.data.data.user)); // Store user info
  
      toast.success("successfully logged in")
      navigate("/"); // Navigate to Dashboard
    } catch (error) {
      // alert(error.response?.data?.message || "Login failed!");
      toast.error("Error toast notification")
    }
  };
  
  

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 shadow-lg" style={{ width: "350px" }}>
        <h2 className="text-center">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input
              type="email"
              name="email"
              className="form-control"
              placeholder="Email"
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="password"
              name="password"
              className="form-control"
              placeholder="Password"
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
