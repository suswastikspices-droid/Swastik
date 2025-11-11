"use client";
import React, { useEffect, useState } from "react";
import { useCategoryStore } from "../../../store/categoryStoreCards";
import toast, { Toaster } from "react-hot-toast";
import { FaEdit, FaTrash, FaUpload } from "react-icons/fa";

const CategoryManager = () => {
  const {
    categories,
    fetchCategories,
    addCategory,
    updateCategory,
    deleteCategory,
    loading,
  } = useCategoryStore();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    slug: "",
    link: "",
    image: null,
  });
  const [preview, setPreview] = useState(null);
  const [editingId, setEditingId] = useState(null);

  // Fetch all categories initially
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // ✅ Automatically generate slug when typing name
  useEffect(() => {
    if (formData.name.trim()) {
      const generatedSlug = formData.name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-");

      setFormData((prev) => ({
        ...prev,
        slug: generatedSlug,
      }));
    }
  }, [formData.name]);

  // ✅ Handle Image Upload Preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      setPreview(URL.createObjectURL(file));
    }
  };

  // ✅ Handle Form Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editingId) {
      await updateCategory(editingId, formData);
      toast.success("Category updated successfully!");
      setEditingId(null);
    } else {
      await addCategory(formData);
      toast.success("Category added successfully!");
    }

    // Reset form
    setFormData({
      name: "",
      description: "",
      slug: "",
      link: "",
      image: null,
    });
    setPreview(null);
  };

  // ✅ Handle Edit
  const handleEdit = (category) => {
    setEditingId(category._id);
    setFormData({
      name: category.name,
      description: category.description,
      slug: category.slug,
      link: category.link,
      image: null,
    });
    setPreview(category.image);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 py-10 px-4">
      <Toaster position="top-right" />

      <div className="max-w-5xl mx-auto bg-white shadow-2xl rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-amber-600 mb-6 text-center">
          🌶️ Manage Categories
        </h1>

        {/* Form Section */}
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
          encType="multipart/form-data"
        >
          {/* Name */}
          <input
            type="text"
            placeholder="Category Name"
            className="border p-3 rounded-lg w-full"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />

          {/* Hidden Slug */}
          <input type="hidden" value={formData.slug} />

          {/* Product Link */}
          <input
            type="text"
            placeholder="Product Link"
            className="border p-3 rounded-lg w-full"
            value={formData.link}
            onChange={(e) =>
              setFormData({ ...formData, link: e.target.value })
            }
            required
          />

          {/* Description */}
          <textarea
            placeholder="Description"
            className="border p-3 rounded-lg w-full md:col-span-2"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            required
          />

          {/* Upload Image */}
          <div className="md:col-span-2">
            <label className="block text-gray-700 font-medium mb-2">
              Upload Image:
            </label>
            <div className="flex items-center gap-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="border p-2 rounded-lg w-full"
              />
              <FaUpload className="text-amber-600" />
            </div>
            {preview && (
              <img
                src={preview}
                alt="Preview"
                className="mt-3 rounded-lg h-32 w-auto object-cover shadow-md"
              />
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="col-span-1 md:col-span-2 bg-amber-600 text-white font-semibold py-3 rounded-lg hover:bg-amber-700 transition-all"
          >
            {editingId ? "✏️ Update Category" : "➕ Add Category"}
          </button>
        </form>

        {/* Category List */}
        {loading ? (
          <p className="text-center text-gray-600">Loading categories...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {categories.map((category) => (
              <div
                key={category._id}
                className="bg-white border border-amber-100 shadow-md rounded-xl p-4 hover:shadow-lg transition-all duration-300"
              >
                <img
                  src={category.image}
                  alt={category.name}
                  className="rounded-lg w-full h-40 object-cover mb-3"
                />
                <h3 className="font-semibold text-lg mb-1 text-gray-800">
                  {category.name}
                </h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {category.description}
                </p>
                <div className="flex justify-between">
                  <button
                    onClick={() => handleEdit(category)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600 flex items-center gap-1"
                  >
                    <FaEdit /> Edit
                  </button>
                  <button
                    onClick={() => {
                      deleteCategory(category._id);
                      toast.success("Category deleted successfully!");
                    }}
                    className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 flex items-center gap-1"
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

export default CategoryManager;
