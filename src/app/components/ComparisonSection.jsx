"use client";
import React from "react";
import { motion } from "framer-motion";
import { ThumbsUp, ThumbsDown, Heart } from "lucide-react";

const ComparisonSection = () => {
const freshPoints = [
  "Heritage-grade spice blends crafted since 1958",          // reference from About Us :contentReference[oaicite:1]{index=1}
  "Sourced from the finest farms for full aroma & taste",
  "Factory-packed to retain freshness & purity",
  "100% natural – no artificial colours, flavours or salt",   // brand claims: “selling without salt” :contentReference[oaicite:2]{index=2}
  "Modern hygienic milling & packaging processes",
  "Trusted by Indian kitchens for generations"
];

  const ordinaryPoints = [
    "High heat grinding",
    "Random sourcing, low consistency",
    "Basic, generic packaging",
    "Less aroma, dull taste",
    "May contain adulterants",
    "Unhygienic and manual processing",
  ];

  return (
    <section className="flex flex-col items-center justify-center py-16 px-4 sm:px-8 md:px-16 bg-gradient-to-br   text-gray-800">
      <h2 className="text-3xl md:text-4xl font-extrabold text-center text-orange-700 mb-10">
        Suswastik Fresh Spices <span className="text-gray-600">vs</span> Ordinary Spices
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-6xl w-full">
        {/* Fresh Spices Card */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="relative bg-orange-50 p-8 rounded-3xl shadow-md border border-orange-200 backdrop-blur-sm"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-orange-700 flex items-center gap-2">
              Suswastik <span className="text-gray-700">Fresh Spices</span>
            </h3>
            <div className="bg-green-100 text-green-600 p-2 rounded-full shadow">
              <ThumbsUp size={24} />
            </div>
          </div>

          <ul className="space-y-3">
            {freshPoints.map((point, i) => (
              <li key={i} className="flex items-start gap-2 text-orange-700 font-medium">
                <Heart size={16} className="mt-1 text-orange-500" />
                {point}
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Ordinary Spices Card */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="relative bg-orange-200 p-8 rounded-3xl shadow-md border border-orange-300 backdrop-blur-sm"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-white flex items-center gap-2 drop-shadow">
              Ordinary <span className="text-orange-50">Spices</span>
            </h3>
            <div className="bg-red-100 text-red-600 p-2 rounded-full shadow">
              <ThumbsDown size={24} />
            </div>
          </div>

          <ul className="space-y-3">
            {ordinaryPoints.map((point, i) => (
              <li key={i} className="flex items-start gap-2 text-white font-medium">
                <span className="text-orange-100 mt-1">•</span>
                {point}
              </li>
            ))}
          </ul>
        </motion.div>
      </div>

      {/* Background Hand Icon */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 0.08 }}
        transition={{ duration: 1.2 }}
        className="absolute inset-0 flex justify-center items-center pointer-events-none"
      >
         
      </motion.div>
    </section>
  );
};

export default ComparisonSection;
