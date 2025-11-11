"use client";
import React from "react";
import { Award, Star, Percent, Truck } from "lucide-react";

const lucideIcons = {
  Award,
  Star,
  Percent,
  Truck,
};

const UspRibbonSection = () => {
  const uspItems = [
    {
      id: 1,
      iconName: "Award",
      title: "100% Satisfaction",
      subtitle: "Try it to love it!",
      badgeBgColorClass: "bg-green-100",
      iconColorClass: "text-green-600",
    },
    {
      id: 2,
      iconName: "Star",
      title: "100% Genuine Products",
      subtitle: "Guaranteed quality",
      badgeBgColorClass: "bg-yellow-100",
      iconColorClass: "text-yellow-600",
    },
    {
      id: 3,
      iconName: "Percent",
      title: "Membership Discounts",
      subtitle: "",
      badgeBgColorClass: "bg-blue-100",
      iconColorClass: "text-blue-600",
    },
    {
      id: 4,
      iconName: "Truck",
      title: "Free Shipping",
      subtitle: "On orders above Rs 999/-",
      badgeBgColorClass: "bg-purple-100",
      iconColorClass: "text-purple-600",
    },
  ];

  const renderIcon = (name) => {
    const IconComponent = lucideIcons[name];
    return IconComponent ? (
      <IconComponent className="w-10 h-10 md:w-12 md:h-12" />
    ) : null;
  };

  // 🌶️ Ribbon messages with expressive icons
  const ribbonTexts = [
    "❤️ Zone of Fresh Spices",
    "🌿 100% Natural Ingredients",
    "🌶️ Pure Taste, Pure Joy",
    "🧡 Handpicked for You",
    "✨ Authentic Indian Aroma",
    "🥄 Add Flavor to Life",
  ];

  return (
    <section className="usp-ribbon-section mt-0 pt-0">
      {/* 🔸 Infinite Scrolling Ribbon */}
      <div className="bg-gradient-to-r from-orange-500 via-red-500 to-amber-500 text-white py-3 overflow-hidden relative shadow-md">
        {/* Double content for infinite loop */}
        <div className="flex animate-marquee whitespace-nowrap">
          {Array.from({ length: 2 }).map((_, loopIndex) =>
            ribbonTexts.map((text, i) => (
              <span
                key={`${loopIndex}-${i}`}
                className="mx-6 text-lg md:text-xl font-semibold flex items-center gap-2"
              >
                <span className="animate-pulse">💛</span> {text}{" "}
                <span className="animate-pulse-slow">💫</span>
              </span>
            ))
          )}
        </div>
      </div>

      {/* 🔸 USP Icons Section */}
      <div className="container-custom mt-8 pb-8 md:pb-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {uspItems.map((item) => (
            <div
              key={item.id}
              className="text-center flex flex-col items-center space-y-3"
            >
              <div
                className={`w-28 h-28 md:w-32 md:h-32 flex items-center justify-center ${item.badgeBgColorClass} relative overflow-hidden group`}
                style={{
                  borderRadius: "45% 55% 60% 40% / 40% 50% 50% 60%",
                }}
              >
                <div
                  className={`p-2 ${item.iconColorClass} group-hover:scale-110 transition-transform duration-300`}
                >
                  {renderIcon(item.iconName)}
                </div>
              </div>
              <h3 className="text-lg font-bold text-gray-800">{item.title}</h3>
              <p className="text-sm text-gray-600">{item.subtitle}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 🔸 Custom Animations */}
      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .animate-marquee {
          display: inline-flex;
          animation: marquee 50s linear infinite;
          width: max-content;
        }

        /* Pulsing heart / sparkle icons */
        @keyframes pulse {
          0%,
          100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.3);
            opacity: 0.7;
          }
        }
        .animate-pulse {
          animation: pulse 1.2s ease-in-out infinite;
        }

        .animate-pulse-slow {
          animation: pulse 2.5s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
};

export default UspRibbonSection;
