"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import useCartStore from "../../store/useCartStore";
import { Loader2, Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

const Cart = () => {
  const pathname = usePathname();
  const {
    cart,
    loading,
    updateItem,
    removeItem,
    clearCart,
    fetchCart,
    calculateTotals,
  } = useCartStore();

  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [updatingProductId, setUpdatingProductId] = useState(null);

  const themeColor = "#943900";

  // ✅ Load user, token, and userId once
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const savedToken = localStorage.getItem("token");
    const savedUserId = localStorage.getItem("userId");

    if (savedUser && savedToken) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      setToken(savedToken);
      setUserId(savedUserId || parsedUser._id);
      fetchCart(savedUserId || parsedUser._id);
    }
  }, [fetchCart]);

  // ✅ Place order logic
  const handlePlaceOrder = async () => {
    try {
      setIsPlacingOrder(true);

      const savedAddressId = localStorage.getItem("shippingAddressId");
      if (!userId || !token) {
        toast.error("User not authenticated. Please log in again.");
        return;
      }
      if (!savedAddressId) {
        toast.error("Please select or add a shipping address.");
        return;
      }

      const orderData = { userId, addressId: savedAddressId };
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/orders/place-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();
      if (response.ok) {
        toast.success("Order placed successfully!");
        await clearCart(userId);
        window.location.href = "/orders";
      } else {
        toast.error(data.message || "Failed to place order.");
      }
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error("Something went wrong while placing order.");
    } finally {
      setIsPlacingOrder(false);
    }
  };

  // 🧭 If not logged in
  if (!user || !token)
    return (
      <div className="text-center p-6 text-gray-600">
        <ShoppingBag className="mx-auto w-10 h-10 mb-3 text-gray-400" />
        <p>Please log in to view your cart.</p>
        <Link
          href="/login"
          className="mt-3 inline-block px-4 py-2 rounded bg-[#943900] text-white"
        >
          Login Now
        </Link>
      </div>
    );

  // 🕓 Loading cart
  if (loading && !cart?.items?.length)
    return (
      <div className="flex flex-col items-center justify-center p-10 text-gray-600">
        <Loader2 className="animate-spin w-10 h-10 mb-2" style={{ color: themeColor }} />
        <p>Loading your cart...</p>
      </div>
    );

  const totals = calculateTotals();

  return (
    <div className="p-4 sm:p-6 bg-white rounded-xl shadow-md max-w-3xl mx-auto mt-4">
      <h2 className="text-xl font-bold mb-4 text-center" style={{ color: themeColor }}>
        🛒 Your Cart
      </h2>

      {/* Empty cart */}
      {cart?.items?.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-gray-600">
          <img src="/images/emptycart.gif" alt="Empty Cart" className="w-44 mb-6" />
          <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
          <Link
            href="/products"
            className="px-6 py-2.5 text-white rounded-full"
            style={{ backgroundColor: themeColor }}
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <>
          {/* Cart Items */}
          <div className="overflow-y-auto space-y-3 pr-1" style={{ maxHeight: "400px" }}>
            {cart.items.map((item) => {
              const isUpdating = updatingProductId === item.product;

              return (
                <div
                  key={item._id}
                  className="relative flex flex-col sm:flex-row sm:justify-between bg-gray-50 border border-gray-200 rounded-md p-3 shadow-sm"
                >
                  {isUpdating && (
                    <div className="absolute inset-0 bg-white/70 flex items-center justify-center rounded-md z-10">
                      <Loader2 className="animate-spin w-6 h-6" style={{ color: themeColor }} />
                    </div>
                  )}

                  <div className="flex items-center gap-3">
                    <img
                      src={item.productSnapshot?.image || "/no-image.png"}
                      alt={item.productSnapshot?.name}
                      className="w-14 h-14 object-cover rounded-md border"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800">{item.productSnapshot?.name}</h4>
                      <p className="text-sm text-gray-600">
                        ₹{item.productSnapshot?.price} × {item.quantity}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 mt-2 sm:mt-0">
                    <button
                      className="px-2 py-1 rounded bg-gray-200"
                      onClick={async () => {
                        if (item.quantity > 1) {
                          setUpdatingProductId(item.product);
                          await updateItem(userId, item.product, item.quantity - 1);
                          setUpdatingProductId(null);
                        }
                      }}
                      disabled={isUpdating || item.quantity <= 1}
                    >
                      <Minus size={14} />
                    </button>

                    <span className="w-8 text-center">{item.quantity}</span>

                    <button
                      className="px-2 py-1 rounded bg-gray-200"
                      onClick={async () => {
                        setUpdatingProductId(item.product);
                        await updateItem(userId, item.product, item.quantity + 1);
                        setUpdatingProductId(null);
                      }}
                      disabled={isUpdating}
                    >
                      <Plus size={14} />
                    </button>

                    <button
                      className="text-white px-3 py-1 rounded bg-red-600 flex items-center gap-1"
                      onClick={async () => {
                        setUpdatingProductId(item.product);
                        await removeItem(userId, item.product);
                        setUpdatingProductId(null);
                      }}
                      disabled={isUpdating}
                    >
                      <Trash2 size={14} /> Remove
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Totals + Checkout */}
          <div className="mt-6 border-t pt-4 text-right">
            <p>Total Price: ₹{totals.totalPrice.toFixed(2)}</p>
            <p>Discount: ₹{totals.discount.toFixed(2)}</p>
            <p className="text-lg font-semibold text-green-600">
              Grand Total: ₹{totals.grandTotal.toFixed(2)}
            </p>

            <div className="flex justify-end gap-3 mt-4">
              <button
                className="text-white px-4 py-2 rounded bg-red-600"
                onClick={async () => {
                  setIsClearing(true);
                  await clearCart(userId);
                  setIsClearing(false);
                }}
                disabled={isClearing}
              >
                {isClearing ? (
                  <Loader2 className="animate-spin w-4 h-4 inline mr-1" />
                ) : null}
                Clear Cart
              </button>

              {pathname === "/checkout" ? (
                <button
                  className="text-white px-4 py-2 rounded bg-green-600 flex items-center justify-center"
                  onClick={handlePlaceOrder}
                  disabled={isPlacingOrder}
                >
                  {isPlacingOrder ? (
                    <>
                      <Loader2 className="animate-spin w-4 h-4 mr-2" /> Processing...
                    </>
                  ) : (
                    "Place Order"
                  )}
                </button>
              ) : (
                <Link href="/checkout">
                  <button
                    className="text-white px-4 py-2 rounded"
                    style={{ backgroundColor: themeColor }}
                  >
                    Proceed to Checkout →
                  </button>
                </Link>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
