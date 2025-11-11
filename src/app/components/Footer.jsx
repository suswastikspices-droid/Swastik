"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  Phone,
  Mail,
  MapPin,
  Instagram,
  ExternalLink,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const pathname = usePathname();
  const [subCategories, setSubCategories] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  // ✅ Fetch subcategories grouped by subCategory name
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(
          "http://localhost:5000/api/products/all/?limit=100"
        );
        const data = await res.json();

        // Group products by subCategory name
        const grouped = {};
        data.products.forEach((product) => {
          const subCatName = product.subCategory?.name || "Others";
          if (!grouped[subCatName]) grouped[subCatName] = [];
          grouped[subCatName].push({
            title: product.name,
            href: `/products/${product.slug}`,
          });
        });

        // Convert grouped into an array of subCategory items
        const subCategoryMenu = Object.keys(grouped).map((subCatName) => ({
          name: subCatName,
          href: `/products/?subCategory=${encodeURIComponent(subCatName.toLowerCase())}`,
        }));

        setSubCategories(subCategoryMenu);
      } catch (err) {
        console.error("Footer fetch error:", err);
      }
    };

    fetchProducts();
  }, []);

  const quickLinks = [
    { name: "Home", href: "/" },
    { name: "Products", href: "/products" },
    { name: "Contact Us", href: "/contact-us" },
    { name: "About Us", href: "/about-us" },
    { name: "Blog", href: "/blogs" },
    { name: "Privacy & policy", href: "/privacy-policy" },
    { name: "Cancellations policy", href: "/cancellations-policy" },
    { name: "Refund Policy", href: "/refund-policy" },
  ];

  const socialLinks = [
    {
      name: "Instagram",
      icon: Instagram,
      href: "https://www.instagram.com/_suswastik/?igsh=Mmh3czBpbWE5dDU1&utm_source=qr#",
    },
  ];

  return (
    <footer className="bg-[#c05300] text-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div className="space-y-6">
            <Image
              src="/images/logo.webp"
              alt="Company Logo"
              width={160}
              height={68}
              className="h-23 w-auto bg-amber-50 rounded-2xl"
            />
            <p className="text-sm leading-relaxed">
              स्वाद से बढ़कर कुछ नहीं - Bringing authentic Indian flavors to your kitchen. Our spices and food products are carefully selected and processed to ensure the highest quality and authentic taste. 
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <Link
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  className="text-gray-200 hover:text-white transition-colors duration-300"
                  aria-label={social.name}
                >
                  <social.icon className="w-5 h-5" />
                </Link>
              ))} <div className="flex items-center space-x-3">
                <Link href='https://www.amazon.in/l/27943762031?me=A2W6NPLCNAU8Z3&tag=ShopReferral_266c306b-a19c-4a41-b695-d6068f0550e2&ref=sf_seller_app_share_new_ls_srb' target="_blank">
                 <Image
                src="/images/amazon.webp"
                alt="Amazon Logo"
                width={80}
                height={40}
                className="ml-4 hover:cursor-pointer"
              />
              </Link>
          </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-6">
              Quick Links
            </h3>
            <ul className="space-y-4">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm hover:text-white hover:underline transition-colors duration-300 flex items-center"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    {link.name}
                  </Link>
                </li>
              ))}
              
            </ul>
          </div>

          {/* Product Categories (Dynamic from API) */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-6">
              Product Categories
            </h3>
            <ul className="space-y-4">
              {subCategories.length > 0 ? (
                subCategories.map((cat) => (
                  <li key={cat.name}>
                    <Link
                      href={cat.href}
                      className="text-sm hover:text-white hover:underline transition-colors duration-300 flex items-center"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      {cat.name}
                    </Link>
                  </li>
                ))
              ) : (
                <li className="text-sm text-gray-400">Loading categories...</li>
              )}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-6">
              Contact Us
            </h3>
            <div className="space-y-4">
              <div className="flex items-start">
                <MapPin className="w-5 h-5 mr-3 mt-1 flex-shrink-0" />
                <p className="text-sm">
                 P.No.8, S.No.5, Ground Floor, Naina Vihar, Rampura Road, Sanganer, Jaipur-302029
                </p>
              </div>
              <div className="flex items-center">
                <Phone className="w-5 h-5 mr-3 flex-shrink-0" />
                <a
                  href="tel:+919414446467"
                  className="text-sm hover:text-white transition-colors duration-300"
                >
                  +91 9414446467
                </a>
                ,&nbsp;
                <a
                  href="tel:+919414545230"
                  className="text-sm hover:text-white transition-colors duration-300"
                >
                  +91 9414545230
                </a>
              </div>
              <div className="flex items-center">
                <Mail className="w-5 h-5 mr-3 flex-shrink-0" />
                <a
                  href="mailto:Suswastikspices@gmail.com"
                  className="text-sm hover:text-white transition-colors duration-300"
                >
                  Suswastikspices@gmail.com
                </a>
              </div>
            </div>
          </div>
        </div>

     {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-200">© {currentYear} Developed<Link className="cursor-pointer text-green-50  hover:font-bold" href="https://viralnexus.in/"> VIRAL nexus.</Link> All rights reserved.</p>
        </div>
    
      </div>
    </footer>
  );
};

export default Footer;
