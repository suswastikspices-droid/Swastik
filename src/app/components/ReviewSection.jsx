"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import { useTestimonialStore } from "../../store/testimonialStore";

const ReviewSection = () => {
  const { testimonials, fetchTestimonials, loading, error } = useTestimonialStore();

  const [activeIndex, setActiveIndex] = useState(0);

  // ✅ Fetch testimonials on mount
  useEffect(() => {
    fetchTestimonials();
  }, [fetchTestimonials]);

  // ✅ Auto-slide between testimonials
  useEffect(() => {
    if (!testimonials.length) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [testimonials]);

  const goNext = () =>
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  const goPrev = () =>
    setActiveIndex((prev) =>
      prev === 0 ? testimonials.length - 1 : prev - 1
    );

  const active = testimonials[activeIndex];

  return (
    <section className="relative flex flex-col items-center justify-center px-5 py-14 sm:px-8 md:px-16 md:py-20 w-full   text-gray-800 overflow-hidden">
      {/* Brand Logo */}
      <a
        className="sm:mb-10 md:mb-12 hover:opacity-80 transition z-20"
        href="#"
        rel="noopener noreferrer"
      >
        <img
          className="h-20 sm:h-28 md:h-36 mx-auto"
          src="/images/logo.webp"
          alt="Spice Brand Logo"
        />
      </a>

      {/* Heading */}
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-orange-700 mb-6 sm:mb-10 text-center">
        Why India Trusts Our Spices
      </h2>

      {/* Navigation Arrows */}
      {testimonials.length > 1 && (
        <>
          <button
            onClick={goPrev}
            className="absolute left-2 sm:left-5 top-1/2 transform -translate-y-1/2 bg-orange-100 hover:bg-orange-200 text-orange-700 p-2 sm:p-3 rounded-full shadow-md transition-all z-2 active:scale-95"
          >
            <ChevronLeft size={22} className="sm:w-6 sm:h-6" />
          </button>

          <button
            onClick={goNext}
            className="absolute right-2 sm:right-5 top-1/2 transform -translate-y-1/2 bg-orange-100 hover:bg-orange-200 text-orange-700 p-2 sm:p-3 rounded-full shadow-md transition-all z-2 active:scale-95"
          >
            <ChevronRight size={22} className="sm:w-6 sm:h-6" />
          </button>
        </>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-20 text-gray-600 text-lg">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
            className="w-10 h-10 border-4 border-orange-400 border-t-transparent rounded-full mb-4"
          />
          Loading testimonials...
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="text-center text-red-600 font-medium py-10">
          Failed to load testimonials. <br /> {error}
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && testimonials.length === 0 && (
        <div className="text-center text-gray-600 italic py-10">
          No testimonials available yet.
        </div>
      )}

      {/* Active Testimonial */}
      {!loading && !error && testimonials.length > 0 && active && (
        <motion.div
          key={activeIndex}
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center text-center max-w-2xl sm:max-w-3xl transition-all duration-700 ease-in-out z-20 px-3"
        >
          <p className="text-base sm:text-lg md:text-2xl font-medium leading-relaxed mb-6 sm:mb-8 text-gray-700">
            “{active.message || active.text}”
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3">
            {active.image && (
              <img
                className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full border-4 border-orange-200 shadow-md object-cover"
                src={active.image}
                alt={active.name}
              />
            )}
            <div className="text-sm sm:text-base text-gray-700 mt-2 sm:mt-0">
              <a
                href={active.link || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center sm:justify-start gap-1 font-semibold text-lg text-orange-700 hover:text-orange-600 transition-colors"
              >
                {active.name}
                {active.link && <ExternalLink size={16} className="opacity-80" />}
              </a>
              <p className="opacity-80">{active.title}</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Decorative Image */}
      <motion.img
        initial={{ x: 100, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        viewport={{ once: true }}
        src="/images/bowl.png"
        alt="Spices Bowl"
        className="absolute bottom-0 right-0 sm:right-10 md:right-20 w-28 sm:w-40 md:w-72 object-contain pointer-events-none opacity-80 z-10"
      />
    </section>
  );
};

export default ReviewSection;
