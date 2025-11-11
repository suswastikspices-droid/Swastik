"use client";

import React, { useState, useEffect, useRef } from "react";
import { Menu, X, ChevronDown, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ProfileIcon from "./ProfileIcon";
import LoginSignupButton from "./LoginSignupButton";
import HeaderCart from "./HeaderCart";
 

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // ✅ Static Menu (no fetching)
  const menuItems = [
    { title: "Home", href: "/" },
    {
      title: "Products",
     href: "/products",
    },
    { title: "About", href: "/about-us" },
   
    { title: "Contact", href: "/contact-us" },
     { title: "Blogs", href: "/blogs" },
  ];

  const pathname = usePathname();
  const mobileMenuRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      setIsLoggedIn(!!token);
    }
  }, [pathname]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isOpen &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const toggleSubmenu = (title) => {
    setActiveSubmenu(activeSubmenu === title ? null : title);
  };

  const handleMobileMenuClose = () => {
    setIsOpen(false);
    setActiveSubmenu(null);
  };

  return (
    <>
      <nav className="bg-white/95 backdrop-blur-md shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
          <div className="flex justify-between items-center h-16 sm:h-18 md:h-20 relative">

            {/* Left: Logo */}
            <div className="flex items-center justify-start lg:justify-center flex-1">
              <Link href="/" className="flex items-center">
                <Image
                  src="/images/logo.webp"
                  alt="Company Logo"
                  className="h-12 sm:h-14 md:h-20 w-auto"
                  width={100}
                  height={100}
                  priority
                />
              </Link>
            </div>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center space-x-6 absolute left-0">
              {menuItems.map((item) => (
                <div key={item.title} className="relative group">
                  {item.href ? (
                    <Link
                      href={item.href}
                      className={`flex items-center font-medium transition-colors duration-200 hover:text-green-500 py-2 px-1 ${
                        pathname === item.href ? "text-green-500" : "text-gray-700"
                      }`}
                    >
                      {item.title}
                      {item.submenu && (
                        <ChevronDown className="ml-1 w-4 h-4 transform transition-transform duration-300 group-hover:rotate-180" />
                      )}
                    </Link>
                  ) : (
                    <span className="flex items-center font-medium text-gray-700 cursor-pointer hover:text-green-500 py-2 px-1 transition-colors duration-200">
                      {item.title}
                      {item.submenu && (
                        <ChevronDown className="ml-1 w-4 h-4 transform transition-transform duration-300 group-hover:rotate-180" />
                      )}
                    </span>
                  )}

                  {item.submenu && (
                    <div
                      className="absolute left-0 mt-1 w-56 bg-white shadow-xl rounded-lg 
                                  opacity-0 invisible group-hover:opacity-100 group-hover:visible 
                                  transform -translate-y-2 group-hover:translate-y-0 transition-all duration-300
                                  max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
                    >
                      <div className="py-2">
                        {item.submenu.map((subItem) => (
                          <Link
                            key={subItem.title}
                            href={subItem.href}
                            className={`block px-4 py-3 text-sm hover:text-green-500 hover:bg-gray-50 transition-colors duration-150 ${
                              pathname === subItem.href
                                ? "text-green-500 bg-gray-50"
                                : "text-gray-600"
                            }`}
                          >
                            {subItem.title}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Right: Search & Login/Profile */}
            <div className="hidden lg:flex items-center gap-5 absolute right-0">
             <Link href={"/distributorForm"}>
              <div className="block font-bold px-4 py-3   text-gray-600 cursor-pointer   hover:text-green-500 ">
                  Become a Partner
                </div>
                 
                </Link>
              <button
                className="p-2 hover:text-green-500 transition-colors duration-200"
                aria-label="Search"
              >
                
                <HeaderCart/>
              </button>
              {isLoggedIn ? <ProfileIcon /> : <LoginSignupButton />}
            </div>

            {/* Mobile Header Controls */}
            <div className="lg:hidden flex items-center gap-2 sm:gap-3 ml-auto">
              <button
                className="p-2 hover:text-green-500 transition-colors duration-200"
                aria-label="Search"
              >
                
                
              </button>
              {isLoggedIn ? (
                <div className="relative z-[60]">
                  <ProfileIcon />
                </div>
              ) : (
                <LoginSignupButton />
              )}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-gray-700 hover:text-green-500 transition-colors duration-200 p-2 active:scale-95"
                aria-label="Toggle menu"
                aria-expanded={isOpen}
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm lg:hidden z-40"
            style={{ top: "64px" }}
            onClick={handleMobileMenuClose}
          />
          <div
            ref={mobileMenuRef}
            className="lg:hidden fixed left-0 right-0 bg-white shadow-2xl z-50 transition-all duration-300 ease-in-out"
            style={{ top: "64px", maxHeight: "calc(100vh - 64px)" }}
          >
            <div className="overflow-y-auto max-h-[calc(100vh-64px)] py-4 px-4 sm:px-6">
              <div className="space-y-1">
                {menuItems.map((item) => (
                  <div key={item.title} className="border-b border-gray-100 last:border-0">
                    {!item.submenu ? (
                      item.href ? (
                        <Link
                          href={item.href}
                          className={`block py-3 sm:py-4 font-medium transition-colors duration-200 ${
                            pathname === item.href
                              ? "text-green-500"
                              : "text-gray-700 hover:text-green-500"
                          }`}
                          onClick={handleMobileMenuClose}
                        >
                          {item.title}
                        </Link>
                      ) : (
                        <span className="block py-3 sm:py-4 font-medium text-gray-700 hover:text-green-500 transition-colors duration-200">
                          {item.title}
                        </span>
                      )
                    ) : (
                      <div>
                        <button
                          className={`flex justify-between items-center w-full py-3 sm:py-4 font-medium transition-colors duration-200 ${
                            activeSubmenu === item.title
                              ? "text-green-500"
                              : "text-gray-700 hover:text-green-500"
                          }`}
                          onClick={() => toggleSubmenu(item.title)}
                        >
                          <span>{item.title}</span>
                          <ChevronDown
                            className={`w-5 h-5 transform transition-transform duration-300 ${
                              activeSubmenu === item.title ? "rotate-180" : ""
                            }`}
                          />
                        </button>
                        <div
                          className={`overflow-hidden transition-all duration-300 ease-in-out ${
                            activeSubmenu === item.title
                              ? "max-h-96 opacity-100"
                              : "max-h-0 opacity-0"
                          }`}
                        >
                          <div className="pl-4 space-y-1 pb-2">
                            {item.submenu.map((subItem) => (
                              <Link
                                key={subItem.title}
                                href={subItem.href}
                                className={`block py-2.5 sm:py-3 text-sm transition-colors duration-200 ${
                                  pathname === subItem.href
                                    ? "text-green-500 font-medium"
                                    : "text-gray-600 hover:text-green-500"
                                }`}
                                onClick={handleMobileMenuClose}
                              >
                                {subItem.title}
                              </Link>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Header;
