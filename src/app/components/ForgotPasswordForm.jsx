"use client";
import React, { useState } from "react";
import axios from "axios";

const ForgotPasswordForm = () => {
  const [step, setStep] = useState("email"); // email | otp
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  const sendOtp = async () => {
    try {
      await axios.post("http://localhost:5000/auth/forgot-password", { email });
      setMessage("OTP sent to email!");
      setStep("otp");
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to send OTP");
    }
  };

  const resetPassword = async () => {
    try {
      await axios.post("http://localhost:5000/auth/reset-password", { email, otp, newPassword });
      setMessage("Password reset successfully!");
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to reset password");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 p-8 border rounded-2xl shadow-lg bg-white">
      {step === "email" ? (
        <>
          <h2 className="text-xl font-bold mb-4">Forgot Password</h2>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full border px-3 py-2 rounded-md mb-4"
          />
          <button onClick={sendOtp} className="w-full bg-indigo-600 text-white py-2 rounded-md">
            Send OTP
          </button>
        </>
      ) : (
        <>
          <h2 className="text-xl font-bold mb-4">Reset Password</h2>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={e => setOtp(e.target.value)}
            className="w-full border px-3 py-2 rounded-md mb-2"
          />
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            className="w-full border px-3 py-2 rounded-md mb-4"
          />
          <button onClick={resetPassword} className="w-full bg-green-600 text-white py-2 rounded-md">
            Reset Password
          </button>
        </>
      )}
      {message && <p className="mt-3 text-center text-sm text-gray-600">{message}</p>}
    </div>
  );
};

export default ForgotPasswordForm;
