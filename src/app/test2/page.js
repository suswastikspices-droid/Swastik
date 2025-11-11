"use client";

import React, { useEffect, useState } from "react";

export default function Navbar() {
  const [menuData, setMenuData] = useState({});

  useEffect(() => {
    // Fetch products from API
    fetch("http://localhost:5000/api/products?limit=100")
      .then((res) => res.json())
      .then((data) => {
        // Group products by subCategory
        const grouped = {};
        data.products.forEach((product) => {
          const subCatName = product.subCategory.name;
          if (!grouped[subCatName]) grouped[subCatName] = [];
          grouped[subCatName].push(product);
        });
        setMenuData(grouped);
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <nav className="bg-gray-800 text-white p-4">
      <ul className="flex space-x-6">
        {Object.keys(menuData).map((subCat) => (
          <li key={subCat} className="relative group">
            {/* SubCategory Name */}
            <span className="cursor-pointer">{subCat}</span>

            {/* Dropdown */}
            <ul className="absolute left-0 mt-2 w-48 bg-white text-gray-800 shadow-lg rounded hidden group-hover:block z-50">
              {menuData[subCat].map((product) => (
                <li key={product._id} className="px-4 py-2 hover:bg-gray-200">
                  <a href={`/product/${product.slug}`}>{product.name}</a>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </nav>
  );
}
