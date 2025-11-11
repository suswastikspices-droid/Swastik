"use client";
import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const OtpVerification = ({ formData, setStep }) => {
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await axios.post("https://swastik-backend-tlka.onrender.com/auth/verify-otp", {
        ...formData,
        otp,
      });

      if (res.data.success) {
        const { token, user } = res.data;

        // ✅ Save all important data to localStorage
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("userId", user._id);

        setMessage("🎉 Registration successful! Redirecting...");

        // ✅ Redirect to home or dashboard after delay
        setTimeout(() => router.push("/"), 1500);
      } else {
        setMessage(res.data.message || "Verification failed");
      }
    } catch (err) {
      console.error("❌ OTP Verification Error:", err);
      setMessage(err.response?.data?.message || "Invalid or expired OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 p-8 border rounded-2xl shadow-lg bg-white">
      <h2 className="text-2xl font-bold mb-4 text-center">Verify OTP</h2>
      <form onSubmit={handleVerify} className="space-y-4">
        <input
          name="otp"
          type="text"
          maxLength="4"
          placeholder="Enter 4-digit OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          required
          className="w-full border px-3 py-2 rounded-md text-center tracking-widest text-lg focus:ring-2 focus:ring-indigo-500"
        />

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 rounded-md transition ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700 text-white"
          }`}
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </button>
      </form>

      <button
        onClick={() => setStep("signup")}
        className="block w-full text-center text-sm text-indigo-600 mt-3"
      >
        Go Back
      </button>

      {message && (
        <p className="mt-3 text-center text-sm text-gray-700">{message}</p>
      )}
    </div>
  );
};

export default OtpVerification;
