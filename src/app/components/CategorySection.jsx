"use client";
import React, { useEffect } from "react";
import Link from "next/link";
import { useCategoryStore } from "../../store/categoryStoreCards";
import { MdOutlineWorkspacePremium } from "react-icons/md";
const CategorySection = () => {
  const { categories, fetchCategories, loading, error } = useCategoryStore();

  // ✅ Fetch categories on mount
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return (
    <section className="pb-8 bg-white">
      <div className="container-custom">
        {/* ✨ Heading */}
        <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-4 bg-gradient-to-r from-amber-600 via-orange-500 to-red-600 bg-clip-text text-transparent tracking-wide drop-shadow-sm animate-fadeIn">
          CATEGORIES <span className="text-amber-600">JO DIL JEET LE!</span>
        </h2>

        {/* 🌟 Description */}
        <p className="text-xl text-center text-gray-600 max-w-3xl mx-auto mb-10">
          Discover our premium spice collection — sourced, crafted, and packed
          to bring <span className="text-amber-600 font-semibold">authentic Indian flavors</span> right to your kitchen.
        </p>

        {/* 🌀 Loading or Error Handling */}
        {loading ? (
          <p className="text-center text-gray-500 italic animate-pulse py-6">
            Loading categories...
          </p>
        ) : error ? (
          <p className="text-center text-red-500 py-6">
            Failed to load categories. Please try again.
          </p>
        ) : categories.length === 0 ? (
          <p className="text-center text-gray-400 italic py-6">
            No categories found. Please add some in the admin panel.
          </p>
        ) : (
          /* ✅ Categories Grid */
       <div className="flex justify-center px-4">
  <div className="grid max-w-6xl grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
    {categories.map((category) => (
      <div
        key={category._id}
        className="bg-amber-50 pt-3 hover:bg-amber-100 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105"
      >
        {/* 🖼️ Image Section */}
        <div className="relative group">
          {/* ✅ Premium badge always visible */}
        <div className="absolute top-4 right-4 z-20 bg-amber-100 text-blue-600 px-3 py-1 rounded-full text-sm font-bold shadow-md flex items-center gap-1">
  <MdOutlineWorkspacePremium className="text-yellow-600 text-lg" />
  <span>Premium</span>
</div>


          {/* ✅ Image wrapper */}
          <div className="h-80 p-6 flex items-center justify-center relative z-10 overflow-hidden rounded-xl">
            <Link href={category.link || "#"}>
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-full object-contain rounded-xl transition-transform duration-300 group-hover:scale-105"
              />
            </Link>
          </div>

          {/* ✅ Optional subtle overlay effect */}
          <div className="absolute inset-0 bg-transparent group-hover:bg-black/5 transition-all duration-300 rounded-xl"></div>
        </div>

        {/* 📄 Content Section */}
        <div className="p-6">
          <h3 className="text-2xl font-bold text-gray-800 mb-3">
            {category.name}
          </h3>
          <p className="text-gray-600 mb-6 line-clamp-3">
            {category.description}
          </p>

          <Link
            href={category.link || "#"}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl inline-block text-center transition-all"
          >
            Shop Now
          </Link>
        </div>
      </div>
    ))}
  </div>
</div>

        )}
      </div>
    </section>
  );
};

export default CategorySection;
