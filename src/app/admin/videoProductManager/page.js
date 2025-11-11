"use client";
import React, { useEffect, useState } from "react";
import { useVideoProductStore } from "../../../store/videoProductStore";
import toast, { Toaster } from "react-hot-toast";
import {
  FaEdit,
  FaTrash,
  FaUpload,
  FaYoutube,
  FaShoppingBag,
  FaSpinner,
  FaPlusCircle,
} from "react-icons/fa";

const VideoProductManager = () => {
  const {
    videoProducts,
    fetchVideoProducts,
    addVideoProduct,
    updateVideoProduct,
    deleteVideoProduct,
    loading,
  } = useVideoProductStore();

  const [formData, setFormData] = useState({
    title: "",
    youtubeUrl: "",
    productUrl: "",
    image: null,
  });
  const [preview, setPreview] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Fetch on load
  useEffect(() => {
    fetchVideoProducts();
  }, [fetchVideoProducts]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      setPreview(URL.createObjectURL(file));
      toast.success("✅ Thumbnail selected for upload!");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.youtubeUrl || !formData.productUrl) {
      toast.error("⚠️ Please fill all fields!");
      return;
    }

    setSubmitting(true);
    try {
      if (editingId) {
        await updateVideoProduct(editingId, formData);
        toast.success("✅ Video product updated successfully!");
        setEditingId(null);
      } else {
        await addVideoProduct(formData);
        toast.success("🎉 Video product added successfully!");
      }

      setFormData({ title: "", youtubeUrl: "", productUrl: "", image: null });
      setPreview(null);
    } catch {
      toast.error("❌ Something went wrong. Try again!");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (product) => {
    setEditingId(product._id);
    setFormData({
      title: product.title,
      youtubeUrl: product.youtubeUrl,
      productUrl: product.productUrl,
      image: null,
    });
    setPreview(product.thumbnail);
    toast("✏️ Edit mode activated");
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this video?")) {
      await deleteVideoProduct(id);
      toast.success("🗑️ Video product deleted successfully!");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-100 py-10 px-4">
      <Toaster position="top-right" reverseOrder={false} />
      <div className="max-w-6xl mx-auto bg-white/95 backdrop-blur-md shadow-2xl rounded-3xl p-8 border border-amber-100">
        {/* Title */}
        <h1 className="text-4xl font-extrabold text-center mb-8 bg-gradient-to-r from-amber-600 via-orange-500 to-red-500 bg-clip-text text-transparent drop-shadow-md">
          🎥 Manage Your Video Products
        </h1>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          encType="multipart/form-data"
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10"
        >
          <input
            type="text"
            placeholder="Product Title"
            className="border border-amber-200 p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-amber-400 outline-none"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />

          <input
            type="text"
            placeholder="YouTube Video URL"
            className="border border-amber-200 p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-amber-400 outline-none"
            value={formData.youtubeUrl}
            onChange={(e) =>
              setFormData({ ...formData, youtubeUrl: e.target.value })
            }
          />

          <input
            type="text"
            placeholder="Product Page URL"
            className="border border-amber-200 p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-amber-400 outline-none"
            value={formData.productUrl}
            onChange={(e) =>
              setFormData({ ...formData, productUrl: e.target.value })
            }
          />

          {/* Image Upload */}
          <div className="flex flex-col items-start">
            <label className="font-medium text-gray-700 mb-2">
              Thumbnail Image
            </label>
            <div className="flex items-center gap-3">
              <label className="cursor-pointer bg-amber-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-amber-700 transition">
                <FaUpload />
                Upload
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </label>
              {preview && (
                <img
                  src={preview}
                  alt="preview"
                  className="h-20 w-20 rounded-lg object-cover border border-gray-200 shadow-sm"
                />
              )}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting}
            className={`col-span-1 md:col-span-2 mt-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold py-3 rounded-lg shadow-md hover:shadow-xl transition transform hover:scale-[1.02] flex items-center justify-center gap-2 ${
              submitting ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {submitting ? (
              <>
                <FaSpinner className="animate-spin" /> Saving...
              </>
            ) : editingId ? (
              <>
                <FaEdit /> Update Video Product
              </>
            ) : (
              <>
                <FaPlusCircle /> Add New Video Product
              </>
            )}
          </button>
        </form>

        {/* Video Product List */}
        {loading ? (
          <p className="text-center text-gray-600 flex justify-center items-center gap-2">
            <FaSpinner className="animate-spin text-amber-600" />
            Loading video products...
          </p>
        ) : videoProducts.length === 0 ? (
          <p className="text-center text-gray-500 italic">
            No video products added yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {videoProducts.map((product) => (
              <div
                key={product._id}
                className="bg-white border border-amber-100 shadow-lg rounded-xl p-4 hover:shadow-2xl transition transform hover:scale-[1.01]"
              >
                <img
                  src={product.thumbnail}
                  alt={product.title}
                  className="rounded-lg w-full h-44 object-cover mb-3 shadow-sm"
                />
                <h3 className="font-semibold text-lg mb-2 text-gray-800 truncate">
                  {product.title}
                </h3>
                <div className="flex flex-col gap-1 mb-4">
                  <a
                    href={product.youtubeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 hover:underline text-sm flex items-center gap-1"
                  >
                    <FaYoutube /> Watch Video
                  </a>
                  <a
                    href={product.productUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-green-600 hover:underline text-sm flex items-center gap-1"
                  >
                    <FaShoppingBag /> View Product
                  </a>
                </div>
                <div className="flex justify-between mt-2">
                  <button
                    onClick={() => handleEdit(product)}
                    className="bg-yellow-500 text-white px-4 py-1 rounded-lg flex items-center gap-2 hover:bg-yellow-600 transition"
                  >
                    <FaEdit /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product._id)}
                    className="bg-red-600 text-white px-4 py-1 rounded-lg flex items-center gap-2 hover:bg-red-700 transition"
                  >
                    <FaTrash /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoProductManager;
