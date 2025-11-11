"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

const SubCategorySection = () => {
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubcategories = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/subcategories`);
        const data = await res.json();

        const list = Array.isArray(data)
          ? data
          : data?.data || data?.subcategories || [];

        const active = list.filter((item) => item.isActive);
        setSubcategories(active);
      } catch (error) {
        console.error("Error fetching subcategories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubcategories();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <Loader2 className="animate-spin text-amber-600 mb-3" size={32} />
        <p className="text-gray-600 font-medium text-sm">
          Loading categories...
        </p>
      </div>
    );
  }

  if (!subcategories.length) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-10 text-orange-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-700 mb-2">
          No Subcategories Found
        </h3>
        <p className="text-gray-500 text-sm text-center max-w-md">
          Check back later for new and exciting categories.
        </p>
      </div>
    );
  }

  // ✅ Animation for each card with 1-second delay per item
  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        delay: i * .15, // 👈 1 second delay between each card
        ease: "easeOut",
      },
    }),
    hover: {
      scale: 1.08,
      rotate: 1.5,
      transition: { duration: 0.3, ease: "easeInOut" },
    },
  };

  return (
    <section className="max-w-7xl mx-auto px-0 md:px-3 py-5 text-center overflow-hidden">
      

      <div className="relative w-full overflow-hidden">
        <div
          className="overflow-x-auto scrollbar-hide scroll-smooth"
          style={{
            overflowY: "hidden",
            WebkitOverflowScrolling: "touch",
            msOverflowStyle: "none",
          }}
        >
          <div className="flex justify-start md:justify-center gap-5 sm:gap-6 pb-4 min-w-max md:min-w-full">
            {subcategories.map((sub, index) => (
              <motion.div
                key={sub._id}
                variants={itemVariants}
                initial="hidden"
                whileInView="visible"
                custom={index}
                viewport={{ once: true, amount: 0.3 }}
                whileHover="hover"
                className="flex flex-col items-center text-center w-[110px] sm:w-[130px] md:w-[150px] flex-shrink-0"
              >
                <Link href={`/products?subCategory=${sub.slug}`}>
                  <motion.div
                    className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 mb-2 flex items-center justify-center rounded-xl bg-white border border-gray-200 shadow-sm hover:shadow-md overflow-hidden"
                    whileHover={{ rotate: 2 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Image
                      src={sub.image}
                      alt={sub.name}
                      fill
                      className="object-contain rounded-xl transition-transform duration-700 ease-out drop-shadow-sm"
                    />
                  </motion.div>

                  <motion.h3
                    className="text-xs sm:text-sm md:text-base font-semibold text-gray-800 uppercase transition-colors duration-300 line-clamp-1"
                    whileHover={{ color: "#b45309" }}
                  >
                    {sub.name}
                  </motion.h3>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SubCategorySection;
