"use client";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Users, TrendingUp, Award } from "lucide-react";
import Link from "next/link";

const SuswastikB2B = () => {
  return (
    <section className="bg-white rounded-2xl shadow-md p-8 max-w-6xl mx-auto my-16 border border-gray-100">
      {/* 🏷️ Header Row */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
            <Users className="w-5 h-5 text-blue-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800">
            SUSWASTIK B2B
          </h2>
        </div>

        <div className="bg-amber-500 text-white text-sm font-semibold px-3 py-1 rounded-full">
          NEW
        </div>
      </div>

      {/* 🖼️ Product Image */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        viewport={{ once: true }}
        className="flex justify-center mb-6"
      >
        <div className="rounded-2xl overflow-hidden shadow-sm bg-gray-50 p-3">
          <Image
            src="/images/poaster.png" // 👈 replace with your actual image path
            alt="Suswastik B2B Spice Range"
            width={640}
            height={360}
            className="rounded-xl object-contain"
          />
        </div>
      </motion.div>

      {/* 🧂 Title and Description */}
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          Perfect Blend of Quality & Convenience
        </h3>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Unlock exclusive wholesale pricing on bulk orders. Perfect for{" "}
          <span className="font-medium">restaurants, retailers,</span> and{" "}
          <span className="font-medium">distributors</span> who value quality,
          consistency, and authenticity.
        </p>
      </div>

      {/* 🏷️ Feature Tags */}
      <div className="flex flex-wrap justify-center gap-4 mb-8">
        <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full text-sm text-gray-800">
          <Users className="w-4 h-4 text-green-600" />
          Bulk Orders
        </div>
        <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full text-sm text-gray-800">
          <TrendingUp className="w-4 h-4 text-blue-600" />
          Wholesale Pricing
        </div>
        <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full text-sm text-gray-800">
          <Award className="w-4 h-4 text-orange-600" />
          100% Pure
        </div>
      </div>

      {/* 🟡 CTA Button */}
      <div className="text-center">
        <Link href="/distributorForm" aria-label="Get Wholesale Prices">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className="bg-amber-500 hover:bg-amber-600 text-white font-semibold px-8 py-3 rounded-full shadow-md transition-all"
          >
            Get Wholesale Prices
          </motion.button>
        </Link>
      </div>
    </section>
  );
};

export default SuswastikB2B;
