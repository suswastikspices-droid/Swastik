"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaHome, FaChevronLeft, FaTimes } from "react-icons/fa";
import { LuComponent } from "react-icons/lu";

export default function Sidebar({ open, collapsed, setCollapsed, setSidebarOpen }) {
  const pathname = usePathname();

  const navItems = [
     
       
     { label: "Quiries", path: "/admin/queries", icon: <LuComponent /> },
   
     { label: "Blogs", path: "/admin/blogs", icon: <LuComponent /> },
    { label: "Hero Section", path: "/admin/hero", icon: <LuComponent /> },
    
    
    { label: "Category", path: "/admin/category", icon:  <LuComponent /> },
     { label: "Testimonials", path: "/admin/testimonials", icon:  <LuComponent /> },
     { label: "Category Cards Homepage", path: "/admin/categoryManager", icon:  <LuComponent /> },
    { label: "Users", path: "/admin/users", icon: <LuComponent /> },
     { label: "video Product Manager", path: "/admin/videoProductManager", icon: <LuComponent /> },
    { label: "Company", path: "/admin/company", icon: <LuComponent /> },
    // Add more items here
  ];

  return (
    <div
      className={`fixed top-0 left-0 h-full z-50 transition-all duration-300 ease-in-out
        ${open ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0
        ${collapsed ? "w-[72px]" : "w-[260px]"}
        shadow-2xl overflow-y-auto bg-white`}
    >
      {/* Mobile close button */}
      <div className="flex justify-end p-3 md:hidden">
        <FaTimes
          className="cursor-pointer text-xl hover:text-red-400 transition"
          onClick={() => setSidebarOpen(false)}
        />
      </div>

      {/* Logo */}
      {(open || typeof window !== "undefined" && window.innerWidth >= 768) && (
        <div className="flex items-center h-19 mb-4 px-3">
          <div className={`relative overflow-hidden   p-2 rounded ${collapsed ? "h-20 w-40" : "h-20 w-60"}`}>
            <img src="/images/logo.webp" alt="Logo" className="h-full w-full object-contain" />
          </div>
        </div>
      )}

      {/* Collapse button */}
      <div className="hidden md:flex justify-end mt-5 px-3 pb-3">
        <FaChevronLeft
          onClick={() => setCollapsed(!collapsed)}
          className={`cursor-pointer transition-transform duration-300 ${collapsed ? "rotate-180" : ""}`}
        />
      </div>

      {/* Navigation */}
      <ul className="space-y-3 px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <li key={item.label}>
              <Link
                href={item.path}
                className={`group flex items-center gap-4 py-2 rounded-xl transition-all duration-300 ${
                  isActive ? "font-semibold text-blue-600" : "hover:opacity-80"
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                {/* Icon */}
                <div
                  className={`flex items-center justify-center min-w-10 h-10 rounded-xl text-xl transition-transform duration-300 group-hover:scale-110 ${
                    collapsed ? "mx-auto" : ""
                  }`}
                >
                  {item.icon}
                </div>

                {/* Label */}
                {!collapsed && <span className="text-sm font-medium tracking-wide">{item.label}</span>}
              </Link>
            </li>
          );
        })}
      </ul>

      {/* Bottom Info */}
      {!collapsed && (
        <div className="absolute bottom-3 left-4 right-4 text-xs text-center border-t border-gray-200 pt-4">
          © 2025 AdminPanel
        </div>
      )}
    </div>
  );
}
