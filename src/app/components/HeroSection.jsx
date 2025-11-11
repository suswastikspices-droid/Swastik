"use client";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

// API configuration
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_API_BASE_URL}`;
const HERO_IMAGES_ENDPOINT = `${API_BASE_URL}/hero`;

const HeroSection = () => {
  const [heroImages, setHeroImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  // swipe refs
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  // fetch images
  const fetchHeroImages = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(HERO_IMAGES_ENDPOINT);

      // save to cache with timestamp
      localStorage.setItem(
        "heroImages",
        JSON.stringify({ data, savedAt: Date.now() })
      );

      setHeroImages(data || []);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to fetch hero images");
    } finally {
      setLoading(false);
    }
  };

  // load from cache or API
  useEffect(() => {
    const cached = localStorage.getItem("heroImages");
    const tenMinutes = 10 * 60 * 1000;

    if (cached) {
      const parsed = JSON.parse(cached);
      const isExpired = Date.now() - parsed.savedAt > tenMinutes;

      if (!isExpired && parsed.data?.length) {
        setHeroImages(parsed.data);
        setLoading(false);
        return;
      } else {
        localStorage.removeItem("heroImages");
      }
    }

    fetchHeroImages();
  }, []);

  // auto-advance
  useEffect(() => {
    if (heroImages.length <= 1) return;
    const id = setInterval(() => {
      setCurrentIndex((i) => (i === heroImages.length - 1 ? 0 : i + 1));
    }, 5000);
    return () => clearInterval(id);
  }, [heroImages]);

  // swipe handlers
  const handleTouchStart = (e) => (touchStartX.current = e.touches[0].clientX);
  const handleTouchMove = (e) => (touchEndX.current = e.touches[0].clientX);
  const handleTouchEnd = () => {
    const delta = touchStartX.current - touchEndX.current;
    if (delta > 50) goToNext();
    if (delta < -50) goToPrev();
  };

  const goToPrev = () =>
    setCurrentIndex((i) => (i === 0 ? heroImages.length - 1 : i - 1));
  const goToNext = () =>
    setCurrentIndex((i) => (i === heroImages.length - 1 ? 0 : i + 1));
  const goToSlide = (i) => setCurrentIndex(i);

  // states
  if (loading) {
    return (
      <div className="relative w-full h-96 bg-gray-200 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative w-full h-96 bg-red-50 flex items-center justify-center">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (!heroImages.length) {
    return (
      <div className="relative w-full h-96 bg-gray-100 flex items-center justify-center">
        <p className="text-gray-600">No hero images available</p>
      </div>
    );
  }

  return (
    <div
      className="relative w-full h-96 md:h-[500px] overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* SLIDING TRACK */}
      <div
        className="absolute inset-0 flex h-full transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {heroImages.map((image) => (
          <a
            key={image._id}
            href={image.link}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full h-full flex-shrink-0"
          >
            {/* One slide = full viewport width */}
            <picture>
              {/* Desktop source */}
              <source media="(min-width: 768px)" srcSet={image.desktopImageUrl} />
              {/* Mobile fallback */}
              <img
                src={image.mobileImageUrl || image.desktopImageUrl}
                alt={image.alt || "Hero slide"}
                className="w-full h-full object-cover"
              />
            </picture>
          </a>
        ))}
      </div>

      {/* ARROWS */}
      {heroImages.length > 1 && (
        <>
          <button
            onClick={goToPrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-green-600/70 hover:bg-green-600 text-white p-2 rounded-full transition-all shadow-md"
            aria-label="Previous slide"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-green-600/70 hover:bg-green-600 text-white p-2 rounded-full transition-all shadow-md"
            aria-label="Next slide"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* DOTS */}
      {heroImages.length > 1 && (
        <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
          {heroImages.map((_, i) => (
            <button
              key={i}
              onClick={() => goToSlide(i)}
              className={`w-3 h-3 rounded-full transition-all ${
                i === currentIndex ? "bg-green-600" : "bg-white/60"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default HeroSection;
