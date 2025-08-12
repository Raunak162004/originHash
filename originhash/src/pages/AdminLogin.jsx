import { FaUser, FaLock } from "react-icons/fa";
import illustration from "../assets/illustarion.png";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdminLogin = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [wrongAttempts, setWrongAttempts] = useState(0);
  const [lockoutTime, setLockoutTime] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (lockoutTime && Date.now() < lockoutTime) {
      toast.error("Login disabled for 1 hour due to too many failed attempts.");
      return;
    }

    if (!username || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    const payload = { username, password };

    try {
      setLoading(true);
      const res = await axios.post(
        "https://originhash.onrender.com/api/v1/admin/login",
        payload
      );

      const { token, isSuperAdmin } = res.data;

      if (token) {
        // save in localStorage
        localStorage.setItem("token", token);
        localStorage.setItem("isSuperAdmin", isSuperAdmin);

        toast.success("Admin login successful!");
        setWrongAttempts(0);
        setLockoutTime(null);

        setTimeout(() => {
          navigate("/admin/courses");
        }, 1000);
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (err) {
      setWrongAttempts((prev) => {
        const attempts = prev + 1;
        if (attempts >= 5) {
          setLockoutTime(Date.now() + 60 * 60 * 1000);
          toast.error("Too many attempts. Login disabled for 1 hour.");
        }
        return attempts;
      });
      toast.error(err.response?.data?.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#6C4CFF]/50 to-[#edeef7]/60 p-4 relative">
      {/* Circles */}
      <span
        className="forgot-circle absolute z-0"
        style={{
          width: "9vw",
          height: "9vw",
          minWidth: "60px",
          minHeight: "60px",
          maxWidth: "120px",
          maxHeight: "120px",
          borderRadius: "50%",
          background: "white",
          opacity: 0.8,
          boxShadow: "0 0 40px 0 #e0e7ff",
          top: "20%",
          left: "15%",
          transform: "translate(-110%, -110%)",
        }}
      ></span>
      <span
        className="forgot-circle absolute z-0"
        style={{
          width: "9vw",
          height: "9vw",
          minWidth: "60px",
          minHeight: "60px",
          maxWidth: "120px",
          maxHeight: "120px",
          borderRadius: "50%",
          background: "#735FFF",
          opacity: 0.7,
          boxShadow: "0 0 40px 0 #7568ff44",
          bottom: "20%",
          right: "15%",
          transform: "translate(110%, 110%)",
        }}
      ></span>

      {/* Card */}
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-5xl grid md:grid-cols-2 overflow-hidden relative z-10" style={{ minHeight: "600px" }}>
        {/* Right Illustration */}
        <div className="bg-[#735fff] hidden md:flex items-center justify-center">
          <img
            src={illustration}
            alt="Illustration"
            className="w-[60%] max-w-md drop-shadow-xl rounded-2xl"
          />
        </div>

        {/* Left Form */}
        <div className="flex flex-col justify-center p-10">
          <h2 className="text-3xl font-bold text-center mb-2">Admin Login</h2>
          <p className="text-center text-gray-500 mb-6">
            Enter your credentials to access admin dashboard
          </p>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="flex items-center gap-2 bg-gray-100 px-4 py-3 rounded-xl">
              <FaUser className="text-gray-400" />
              <input
                type="text"
                placeholder="Enter your username"
                className="bg-transparent w-full outline-none"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-2 bg-gray-100 px-4 py-3 rounded-xl">
              <FaLock className="text-gray-400" />
              <input
                type="password"
                placeholder="Enter your password"
                className="bg-transparent w-full outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={
                loading ||
                (lockoutTime && Date.now() < lockoutTime) ||
                wrongAttempts >= 5
              }
              className="w-full bg-[#6C4CFF] hover:bg-[#5c3fe0] text-white py-3 rounded-xl shadow-md font-semibold transition"
            >
              {lockoutTime && Date.now() < lockoutTime
                ? "Login disabled for 1 hour"
                : wrongAttempts >= 5
                ? "Too many attempts"
                : loading
                ? "Logging in..."
                : "Login Now"}
            </button>
          </form>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default AdminLogin;
