"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { FaEnvelope, FaKey, FaLock, FaArrowRight } from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";

export default function ForgotPassword() {
  const router = useRouter();
  const [step, setStep] = useState(1); // Step 1 = send OTP, Step 2 = reset password
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // ----------------------------
  // SEND OTP
  // ----------------------------
  const handleSendOTP = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (data.success) {
        toast.success(data.message);
        setStep(2);
      } else {
        toast.error(data.message || "Failed to send OTP");
      }
    } catch (error) {
      console.error(error);
      toast.error("Server error while sending OTP");
    } finally {
      setLoading(false);
    }
  };

  // ----------------------------
  // RESET PASSWORD
  // ----------------------------
  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!otp || !newPassword) {
      toast.error("Please fill in all fields");
      return;
    }

    if (newPassword.length < 4) {
      toast.error("Password must be at least 4 characters");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, newPassword }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Password reset successful! Redirecting...");
        setTimeout(() => router.push("/login"), 2000);
      } else {
        toast.error(data.message || "Invalid OTP or request");
      }
    } catch (error) {
      console.error(error);
      toast.error("Server error while resetting password");
    } finally {
      setLoading(false);
    }
  };

  // ----------------------------
  // RENDER UI
  // ----------------------------
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-amber-50 to-amber-100">
      <Toaster position="top-center" />
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md border border-amber-200">
        <h2 className="text-2xl font-bold text-amber-800 mb-2 text-center">
          {step === 1 ? "Forgot Password" : "Reset Your Password"}
        </h2>
        <p className="text-amber-600 text-center mb-6">
          {step === 1
            ? "Enter your email to receive an OTP"
            : "Enter the OTP and your new password"}
        </p>

        <form
          onSubmit={step === 1 ? handleSendOTP : handleResetPassword}
          className="space-y-5"
        >
          {/* Step 1: Email Field */}
          {step === 1 && (
            <div className="relative">
              <FaEnvelope className="absolute left-3 top-3 text-amber-500" />
              <input
                type="email"
                placeholder="Enter your registered email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-3 py-3 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white text-gray-700 placeholder-amber-400 transition duration-300"
              />
            </div>
          )}

          {/* Step 2: OTP + New Password */}
          {step === 2 && (
            <>
              <div className="relative">
                <FaKey className="absolute left-3 top-3 text-amber-500" />
                <input
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                  className="w-full pl-10 pr-3 py-3 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white text-gray-700 placeholder-amber-400 transition duration-300"
                />
              </div>

              <div className="relative">
                <FaLock className="absolute left-3 top-3 text-amber-500" />
                <input
                  type="password"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-3 py-3 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white text-gray-700 placeholder-amber-400 transition duration-300"
                />
              </div>
            </>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-amber-600 to-amber-700 text-white py-3 rounded-lg font-semibold hover:from-amber-700 hover:to-amber-800 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-md flex items-center justify-center"
          >
            {loading ? (
              <span className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 
                      0 5.373 0 12h4zm2 
                      5.291A7.962 7.962 0 014 12H0c0 
                      3.042 1.135 5.824 3 
                      7.938l3-2.647z"
                  ></path>
                </svg>
                Processing...
              </span>
            ) : step === 1 ? (
              <>
                Send OTP <FaArrowRight className="ml-2" />
              </>
            ) : (
              <>
                Reset Password <FaArrowRight className="ml-2" />
              </>
            )}
          </button>
        </form>

        {/* Back to Login Link */}
        <div className="mt-8 text-center">
          <button
            onClick={() => router.push("/signup")}
            className="text-amber-700 font-semibold hover:text-amber-800 transition-colors duration-300"
          >
            Back to Sign up
          </button>
        </div>
      </div>
    </div>
  );
}
