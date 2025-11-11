"use client";
import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiUser,
  FiBriefcase,
  FiMessageSquare,
  FiImage,
  FiEdit2,
  FiTrash2,
  FiPlus,
  FiX,
} from "react-icons/fi";
import { useTestimonialStore } from "../../../store/testimonialStore";

const TestimonialsManager = () => {
  const {
    testimonials,
    form,
    selectedTestimonial,
    loading,
    error,
    fetchTestimonials,
    createTestimonial,
    updateTestimonial,
    deleteTestimonial,
    selectTestimonial,
    setForm,
    resetForm,
  } = useTestimonialStore();

  useEffect(() => {
    fetchTestimonials();
  }, [fetchTestimonials]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedTestimonial && selectedTestimonial._id) {
      updateTestimonial(selectedTestimonial._id);
    } else {
      createTestimonial();
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 md:p-10 bg-gradient-to-b from-indigo-50 via-white to-blue-50 rounded-3xl shadow-inner min-h-screen">
      {/* Header */}
      <motion.h1
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-4xl font-extrabold text-gray-800 mb-10 flex items-center gap-3"
      >
        <FiMessageSquare className="text-blue-600" />
        Testimonials Manager
      </motion.h1>

      {/* Error */}
      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-red-100 text-red-700 border border-red-300 px-4 py-2 rounded-xl mb-5 font-medium shadow-sm"
        >
          {error}
        </motion.div>
      )}

      {/* ================= FORM ================= */}
      <motion.form
        layout
        onSubmit={handleSubmit}
        className="bg-white/80 backdrop-blur-lg border border-gray-100 shadow-lg rounded-2xl p-6 md:p-8 mb-12 space-y-6 transition-all hover:shadow-xl"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name */}
          <div className="relative">
            <FiUser className="absolute top-3.5 left-3 text-gray-400" />
            <input
              type="text"
              placeholder="Full Name"
              className="pl-10 border border-gray-300 w-full p-2.5 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
              value={form.name || ""}
              onChange={(e) => setForm({ name: e.target.value })}
              required
            />
          </div>

          {/* Title */}
          <div className="relative">
            <FiBriefcase className="absolute top-3.5 left-3 text-gray-400" />
            <input
              type="text"
              placeholder="Title / Profession"
              className="pl-10 border border-gray-300 w-full p-2.5 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
              value={form.title || ""}
              onChange={(e) => setForm({ title: e.target.value })}
              required
            />
          </div>
        </div>

        {/* Message */}
        <div className="relative">
          <FiMessageSquare className="absolute top-3 left-3 text-gray-400" />
          <textarea
            placeholder="Message"
            className="pl-10 border border-gray-300 w-full p-2.5 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
            value={form.message || ""}
            onChange={(e) => setForm({ message: e.target.value })}
            rows={3}
            required
          />
        </div>

        {/* Link */}
        <input
          type="text"
          placeholder="Link (optional)"
          className="border border-gray-300 w-full p-2.5 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
          value={form.link || ""}
          onChange={(e) => setForm({ link: e.target.value })}
        />

        {/* Image Upload */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <label className="flex items-center gap-3 cursor-pointer hover:text-blue-600 transition-colors">
            <FiImage className="text-gray-500" />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setForm({
                    imageFile: file,
                    imagePreview: URL.createObjectURL(file),
                  });
                }
              }}
              className="hidden"
            />
            <span className="text-sm text-gray-600">Upload Image</span>
          </label>

          {form.imagePreview && (
            <motion.img
              layout
              src={form.imagePreview}
              alt="Preview"
              className="h-20 w-20 object-cover rounded-xl border border-gray-200 shadow-sm hover:scale-105 transition-transform"
            />
          )}
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap gap-3 pt-3">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl shadow-md font-medium transition"
          >
            {selectedTestimonial && selectedTestimonial._id ? (
              <>
                <FiEdit2 /> Update
              </>
            ) : (
              <>
                <FiPlus /> Create
              </>
            )}
          </button>

          {selectedTestimonial && (
            <button
              type="button"
              onClick={resetForm}
              className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2.5 rounded-xl font-medium transition"
            >
              <FiX /> Cancel
            </button>
          )}
        </div>
      </motion.form>

      {/* ================= TESTIMONIALS LIST ================= */}
      <div>
        <h2 className="text-2xl font-semibold mb-6 text-gray-800 flex items-center gap-2">
          <FiUser className="text-blue-500" />
          All Testimonials
        </h2>

        <AnimatePresence>
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {testimonials.map((t) => (
              <motion.div
                key={t._id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.3 }}
                className="bg-white/90 backdrop-blur-lg border border-gray-100 shadow-lg rounded-2xl p-5 flex flex-col gap-3 hover:shadow-2xl transition-all duration-300"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={t.image}
                    alt={t.name}
                    className="h-16 w-16 rounded-full object-cover border border-gray-300"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-800 text-lg">
                      {t.name}
                    </h3>
                    <p className="text-sm text-gray-500">{t.title}</p>
                  </div>
                </div>

                <p className="text-gray-600 text-sm italic mt-2 line-clamp-3">
                  “{t.message}”
                </p>

                {t.link && (
                  <a
                    href={t.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 text-sm hover:underline font-medium"
                  >
                    View More →
                  </a>
                )}

                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() => selectTestimonial(t)}
                    className="flex-1 flex items-center justify-center gap-1 text-sm border border-gray-300 px-3 py-1.5 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition"
                  >
                    <FiEdit2 /> Edit
                  </button>
                  <button
                    onClick={() => deleteTestimonial(t._id)}
                    className="flex-1 flex items-center justify-center gap-1 text-sm border border-red-300 text-red-600 px-3 py-1.5 rounded-lg hover:bg-red-50 transition"
                  >
                    <FiTrash2 /> Delete
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TestimonialsManager;
