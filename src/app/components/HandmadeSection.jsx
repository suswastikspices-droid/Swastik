"use client";
import Link from "next/link";
import React from "react";
import { motion } from "framer-motion";

const HandmadeSection = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-amber-50 via-white to-orange-50 py-5 px-4">
      {/* 🎥 Animated Background Image (slides from right to normal) */}
      <motion.div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/images/poster.webp')",
        }}
        initial={{ backgroundPositionX: "-120%" }} // starts from right
        whileInView={{ backgroundPositionX: "50%" }} // ends centered
        transition={{
          duration: 2,
          ease: [0.6, 0.01, 0.05, 0.95], // smooth easing
        }}
        viewport={{ once: true }}
      />

      {/* 🔆 Overlay for readability */}
      <div className="absolute inset-0    " />

      {/* 🌟 Main Content */}
      <div className="relative z-10 flex justify-start">
        <motion.div
          className="bg-black/40 backdrop-blur-sm p-4 md:px-6 md:pt-2 rounded-r-3xl max-w-xl w-full text-left"
          initial={{ opacity: 0, x: -60 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <h2
            className="text-3xl md:text-4xl font-extrabold mb-4 bg-gradient-to-r text-amber-400 bg-clip-text tracking-wide"
            style={{
              textShadow:
                "1px 1px 2px rgba(0,0,0,0.25), 0 2px 8px rgba(0,0,0,0.15)",
            }}
          >
            Crafted with Purity. Inspired by{" "}
            <span
              className="text-amber-500"
              style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.3)" }}
            >
              Tradition
            </span>
          </h2>

          <p
            className="text-white text-base md:text-lg font-medium mb-5 leading-relaxed"
            style={{ textShadow: "1px 1px 4px rgba(0,0,0,0.5)" }}
          >
            Experience the authentic essence of Indian craftsmanship — where
            every product is made with care, purity, and a touch of timeless
            heritage. A celebration of flavors, culture, and trust — straight
            from{" "}
            <span
              className="text-amber-500 font-semibold"
              style={{ textShadow: "1px 1px 3px rgba(0,0,0,0.4)" }}
            >
              Suswastik
            </span>
            .
          </p>

          {/* 🌿 Key Highlights */}
          <div className="space-y-5 mb-6 w-full">
            {[
              "🌿 100% Pure & Natural — crafted using the finest ingredients, free from artificial colors or preservatives.",
              "💛 Handcrafted Excellence — blending tradition with quality to deliver authentic taste and freshness.",
              "👩‍🍳 Made with Care — created in small batches to ensure premium quality and consistency in every pack.",
              "🇮🇳 Inspired by India — a perfect balance of traditional wisdom and modern taste for today’s kitchen.",
            ].map((item, index) => (
              <motion.div
                key={index}
                className="flex items-start"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{
                  delay: index * 0.25,
                  duration: 0.6,
                  ease: "easeOut",
                }}
                viewport={{ once: true }}
              >
                <div className="flex-shrink-0 mt-1">
                  <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center shadow">
                    ✓
                  </div>
                </div>
                <p
                  className="ml-4 text-lg text-white"
                  style={{ textShadow: "1px 1px 3px rgba(0,0,0,0.5)" }}
                >
                  {item}
                </p>
              </motion.div>
            ))}
          </div>

          {/* 🛒 Call To Action */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            <Link href="/products">
              <button className="bg-amber-600 text-white font-bold py-3 px-10 rounded-full text-lg transition duration-300 transform hover:scale-105 hover:bg-amber-700 shadow-lg">
                Explore Products
              </button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HandmadeSection;
