"use client";
import React, { useEffect, useRef, useState } from "react";
import { FaPlay } from "react-icons/fa";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";
import { motion } from "framer-motion";
import { useVideoProductStore } from "../../store/videoProductStore";

const FoodVideoGallery = () => {
  const { videoProducts, fetchVideoProducts, loading, error } = useVideoProductStore();
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const scrollRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  useEffect(() => {
    fetchVideoProducts();
  }, [fetchVideoProducts]);

  useEffect(() => {
    if (error) toast.error("Failed to load videos!");
  }, [error]);

  const handleVideoOpen = (youtubeUrl, productUrl) => {
    const normalizedUrl = youtubeUrl.startsWith("http")
      ? youtubeUrl
      : `https://${youtubeUrl}`;
    setSelectedVideo(normalizedUrl);
    setSelectedProduct(productUrl);
  };

  // ✅ Mouse drag scroll handlers
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };
  const handleMouseLeave = () => setIsDragging(false);
  const handleMouseUp = () => setIsDragging(false);
  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  // 🎬 Animation Variants
  const cardVariants = {
    hidden: { opacity: 0, x: 80 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
        delay: i * 0.15, // 🕐 Each card appears 0.15s after the previous one
        ease: "easeOut",
      },
    }),
  };

  return (
    <section className="max-w-7xl mx-auto px-3 md:px-6 py-10 select-none relative">
      <Toaster position="top-right" reverseOrder={false} />

      {/* 🧡 Section Heading */}
      <motion.h2
        className="text-3xl md:text-4xl font-extrabold text-center mb-4 bg-gradient-to-r from-amber-600 via-orange-500 to-red-600 bg-clip-text text-transparent tracking-wide"
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        Asli Moments. Asli Love for{" "}
        <span className="text-amber-700">Suswastik</span>
      </motion.h2>

      <motion.p
        className="text-center text-gray-600 text-base md:text-lg font-medium max-w-2xl mx-auto mb-8"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        viewport={{ once: true }}
      >
        Celebrate every moment with authentic Indian flavors crafted with care
        and tradition.
      </motion.p>

      {/* 🧠 Loading / Empty / Display */}
      {loading ? (
        <p className="text-center text-gray-500 italic py-8 animate-pulse">
          Loading your favorite videos...
        </p>
      ) : videoProducts.length === 0 ? (
        <p className="text-center text-gray-400 italic py-8">
          No videos found. Please check back later.
        </p>
      ) : (
        <div
          ref={scrollRef}
          className="overflow-x-scroll no-scrollbar cursor-grab active:cursor-grabbing"
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
        >
          <div
            className="flex gap-6 md:gap-8 pb-4 w-max mx-auto"
            style={{ scrollBehavior: "smooth" }}
          >
            {videoProducts.map((video, index) => {
              const thumbnail = video.thumbnail || "/placeholder.webp";
              return (
                <motion.div
                  key={video._id}
                  className="relative flex-shrink-0 w-[230px] sm:w-[260px] md:w-[280px] flex flex-col items-center group transition-all duration-300"
                  variants={cardVariants}
                  initial="hidden"
                  whileInView="visible"
                  custom={index}
                  viewport={{ once: true }}
                >
                  {/* Thumbnail */}
                  <div
                    onClick={() =>
                      handleVideoOpen(video.youtubeUrl, video.productUrl)
                    }
                    className="relative aspect-[9/16] w-full rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl cursor-pointer transition-all duration-300"
                  >
                    <img
                      src={thumbnail}
                      alt={video.title}
                      className="w-full h-full object-cover rounded-2xl group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 flex items-center justify-center group-hover:bg-black/25 transition-all">
                      <FaPlay
                        size={52}
                        className="text-white opacity-90 group-hover:scale-125 transition-transform"
                      />
                    </div>
                    <div className="absolute bottom-2 left-2 right-2 text-white text-base text-center font-medium bg-black/40 rounded-lg px-2 py-1 line-clamp-1 backdrop-blur-sm">
                      {video.title}
                    </div>
                  </div>

                  {/* Buy Button */}
                  <Link
                    href={video.productUrl || "/products"}
                    className="mt-3 inline-block bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-5 py-2 rounded-full shadow-md hover:shadow-lg transition-all"
                  >
                    Buy This Product
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* 🎥 Modal */}
      {selectedVideo && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="relative w-full max-w-4xl mx-auto p-4">
            <button
              onClick={() => {
                setSelectedVideo(null);
                setSelectedProduct(null);
              }}
              className="absolute top-2 right-2 text-white bg-red-600 hover:bg-red-700 rounded-full p-2 transition"
            >
              ✕
            </button>

            <div className="aspect-video rounded-lg overflow-hidden shadow-lg mb-4">
              <iframe
                width="100%"
                height="100%"
                src={`${selectedVideo}?autoplay=1`}
                title="YouTube video player"
                frameBorder="0"
                allow="autoplay; encrypted-media"
                allowFullScreen
                className="rounded-lg"
              ></iframe>
            </div>

            <div className="flex justify-center">
              <Link
                href={selectedProduct || "/products"}
                className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-full shadow-md hover:shadow-lg transition-all"
              >
                Buy This Product
              </Link>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default FoodVideoGallery;
