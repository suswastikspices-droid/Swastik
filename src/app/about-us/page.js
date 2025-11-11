"use client";
import React from "react";
import { motion } from "framer-motion";
import {
  FaLeaf,
  FaHandsHelping,
  FaAward,
  FaHeart,
  FaSeedling,
  FaUsers,
} from "react-icons/fa";

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white text-gray-800">
      {/* Header Section */}
      <motion.section
        className="relative text-white text-center py-20 px-6 shadow-md overflow-hidden"
        initial={{ opacity: 0, y: 80 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        viewport={{ once: true }}
        style={{
          backgroundImage: "url('/images/poster-aboit.webp')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Gradient Overlay */}
        <motion.div
          className="absolute inset-0   backdrop-blur-[1px]"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
        ></motion.div>

        {/* Text */}
        <motion.div
          className="relative z-10 max-w-3xl mx-auto text-white"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="inline-block bg-black/30 backdrop-blur-sm px-8 py-6 rounded-2xl shadow-xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight drop-shadow-lg">
              About Us
            </h1>
            <p className="text-lg md:text-xl max-w-2xl mx-auto leading-relaxed text-gray-100">
              At <strong>Suswastik Spices</strong>, we bring the authentic taste of
              India to your kitchen — blending tradition, purity, and passion in
              every grain of spice.
            </p>
          </div>
        </motion.div>
      </motion.section>

      {/* Our Story Section */}
      <motion.section
        className="max-w-6xl mx-auto px-6 md:px-16 py-20"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
      >
        <h2 className="text-3xl md:text-4xl font-bold text-[#BB4D00] mb-6 text-center">
          Our Story
        </h2>
        <p className="text-lg text-gray-700 leading-relaxed text-center max-w-4xl mx-auto">
          Founded with a deep respect for India’s culinary heritage, Suswastik
          Spices started as a small family endeavor and has grown into one of
          the most trusted names in pure, aromatic, and ethically sourced
          spices. Every product we create carries the essence of our tradition —
          crafted with care, precision, and a commitment to excellence.
        </p>

        <p className="text-lg text-gray-700 leading-relaxed text-center mt-6 max-w-4xl mx-auto">
          From the farms to your plate, our mission is to preserve the true
          flavor of India while promoting health and authenticity. Each batch is
          carefully selected, tested, and packed to ensure only the best reaches
          you.
        </p>
      </motion.section>

      {/* Vision & Mission */}
      <motion.section
        className="bg-white py-20 border-t border-orange-100"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
      >
        <div className="max-w-6xl mx-auto px-6 md:px-16 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-[#BB4D00] mb-4">
              Our Vision
            </h2>
            <p className="text-gray-700 text-lg leading-relaxed">
              To be a globally recognized spice brand known for its quality,
              purity, and innovation while promoting sustainable and fair trade
              practices across the spice industry.
            </p>
          </div>

          <div>
            <h2 className="text-3xl font-bold text-[#BB4D00] mb-4">
              Our Mission
            </h2>
            <p className="text-gray-700 text-lg leading-relaxed">
              To deliver authentic, natural, and high-quality spices that bring
              joy and health to every meal — while empowering local farmers and
              preserving traditional Indian flavors for generations to come.
            </p>
          </div>
        </div>
      </motion.section>

      {/* Why Choose Us */}
      <motion.section
        className="py-20 px-6 md:px-16 bg-gradient-to-b from-orange-100 to-white"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
      >
        <h2 className="text-3xl md:text-4xl font-bold text-[#BB4D00] mb-12 text-center">
          Why Choose Suswastik Spices?
        </h2>

        <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
          <FeatureCard
            icon={<FaLeaf size={30} />}
            title="100% Natural & Pure"
            desc="Our spices are naturally sourced and free from artificial colors or preservatives."
          />
          <FeatureCard
            icon={<FaAward size={30} />}
            title="Quality You Can Trust"
            desc="Each batch is quality-checked for freshness, aroma, and purity — ensuring world-class standards."
          />
          <FeatureCard
            icon={<FaHandsHelping size={30} />}
            title="Empowering Farmers"
            desc="We work directly with local farmers, ensuring fair trade and sustainable sourcing practices."
          />
          <FeatureCard
            icon={<FaSeedling size={30} />}
            title="Sustainable Production"
            desc="We care for our planet — using eco-friendly packaging and responsible manufacturing."
          />
          <FeatureCard
            icon={<FaHeart size={30} />}
            title="Passion for Flavor"
            desc="Each spice blend is crafted with love, carrying our passion for great taste and good health."
          />
          <FeatureCard
            icon={<FaUsers size={30} />}
            title="Trusted by Families"
            desc="For generations, homes have chosen Suswastik Spices as a symbol of purity and authenticity."
          />
        </div>
      </motion.section>

     
    </div>
  );
}

/* --- Reusable Feature Card --- */
function FeatureCard({ icon, title, desc }) {
  return (
    <motion.div
      className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl text-center transition-all duration-300 border border-orange-100"
      whileHover={{ scale: 1.05 }}
    >
      <div className="text-[#BB4D00] mb-4 flex justify-center">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 text-base leading-relaxed">{desc}</p>
    </motion.div>
  );
}
