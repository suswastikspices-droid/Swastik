"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingCart } from "lucide-react";
import  useCartStore  from "../../store/useCartStore";

const FloatingCartButton = () => {
  const router = useRouter();
  const { cart } = useCartStore();
  const [visible, setVisible] = useState(false);
  const [count, setCount] = useState(0);

  // ✅ Update visibility and count whenever cart changes
  useEffect(() => {
    if (cart && cart.items && cart.items.length > 0) {
      setVisible(true);
      setCount(cart.items.reduce((acc, item) => acc + item.quantity, 0));
    } else {
      setVisible(false);
      setCount(0);
    }
  }, [cart]);

  if (!visible) return null;

  return (
    <div
      onClick={() => router.push("/cart")}
      className="fixed bottom-6 z-100000 right-6 bg-amber-500 text-white rounded-full shadow-lg cursor-pointer flex items-center justify-center w-14 h-14 transition-transform duration-300 hover:scale-110"
    >
      <ShoppingCart size={28} />
      {count > 0 && (
        <span className="absolute -top-1 -right-1 bg-white text-[#bb4d00] text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-md">
          {count}
        </span>
      )}
    </div>
  );
};

export default FloatingCartButton;
