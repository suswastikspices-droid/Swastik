"use client";

import React from "react";
import Link from "next/link";

const LoginSignupButton = () => {
  return (
    <div className="flex items-center gap-3">
      <Link
        href="/login"
        className="px-4 py-2  bg-green-500  text-amber-50 rounded-md hover:bg-green-700 transition-colors"
      >
        Login
      </Link>
      {/* 
      <Link
        href="/signup"
        className="px-4 py-2 border border-indigo-600 text-indigo-600 rounded-md hover:bg-indigo-50 transition-colors"
      >
        Sign Up
      </Link>
      */}
    </div>
  );
};

export default LoginSignupButton;
