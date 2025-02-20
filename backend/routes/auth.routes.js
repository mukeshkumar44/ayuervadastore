import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";

const Auth = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState("register"); // "register", "verify", "login"
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    otp: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Register User
  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/auth/register", formData);
      toast.success(res.data.message);
      setStep("verify");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  // Verify OTP
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/auth/verify-otp", {
        email: formData.email,
        otp: formData.otp
      });
      toast.success(res.data.message);
      setStep("login");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  // Login User
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/auth/login", {
        email: formData.email,
        password: formData.password
      });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      toast.success("Login successful!");
      navigate("/");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      {step === "register" && (
        <form onSubmit={handleRegister}>
          <h2 className="text-xl font-semibold mb-4">Register</h2>
          <input type="text" name="name" placeholder="Full Name" onChange={handleChange} required className="w-full border p-2 mb-2" />
          <input type="email" name="email" placeholder="Email" onChange={handleChange} required className="w-full border p-2 mb-2" />
          <input type="password" name="password" placeholder="Password" onChange={handleChange} required className="w-full border p-2 mb-2" />
          <input type="text" name="phone" placeholder="Phone" onChange={handleChange} required className="w-full border p-2 mb-2" />
          <button type="submit" className="w-full bg-green-600 text-white p-2 rounded">Register</button>
        </form>
      )}
      
      {step === "verify" && (
        <form onSubmit={handleVerifyOTP}>
          <h2 className="text-xl font-semibold mb-4">Verify OTP</h2>
          <input type="text" name="otp" placeholder="Enter OTP" onChange={handleChange} required className="w-full border p-2 mb-2" />
          <button type="submit" className="w-full bg-green-600 text-white p-2 rounded">Verify OTP</button>
        </form>
      )}
      
      {step === "login" && (
        <form onSubmit={handleLogin}>
          <h2 className="text-xl font-semibold mb-4">Login</h2>
          <input type="email" name="email" placeholder="Email" onChange={handleChange} required className="w-full border p-2 mb-2" />
          <input type="password" name="password" placeholder="Password" onChange={handleChange} required className="w-full border p-2 mb-2" />
          <button type="submit" className="w-full bg-green-600 text-white p-2 rounded">Login</button>
        </form>
      )}
    </div>
  );
};

export default Auth;
