"use client";

import React, { useEffect, useState, Suspense } from "react";
import axios from "axios";
import dayjs from "dayjs";
import {
  FileDown,
  Package,
  Loader2,
  Calendar,
  CreditCard,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  const BASE_URL = "http://localhost:5000/api";
  const primaryColor = "#943900";

  // 🟢 Read user & token from localStorage (client-side only)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      const storedToken = localStorage.getItem("token");
      setUser(storedUser);
      setToken(storedToken);
    }
  }, []);

  // 🟢 Fetch user orders
  useEffect(() => {
    if (!user?._id || !token) return;

    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${BASE_URL}/orders/user/${user._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(res.data.orders || []);
      } catch (error) {
        console.error("❌ Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user?._id, token]);

  // 🧾 Download invoice
  const handleDownloadInvoice = async (orderId) => {
    try {
      const res = await axios.get(`${BASE_URL}/orders/invoice/${orderId}`, {
        responseType: "blob",
        headers: { Authorization: `Bearer ${token}` },
      });

      const file = new Blob([res.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(file);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Invoice-${orderId}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("❌ Failed to download invoice:", error);
      alert("Failed to download invoice. Please try again.");
    }
  };

  // 🧩 Loading state
  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-[60vh]">
        <Loader2
          className="animate-spin"
          size={48}
          style={{ color: primaryColor }}
        />
        <p
          className="mt-4 text-lg font-medium"
          style={{ color: primaryColor }}
        >
          Loading your orders...
        </p>
      </div>
    );
  }

  // Get status icon based on order status
  const getStatusIcon = (status) => {
    switch (status) {
      case "processing":
        return <Clock size={16} className="text-yellow-600" />;
      case "completed":
        return <CheckCircle size={16} className="text-green-600" />;
      case "cancelled":
        return <XCircle size={16} className="text-red-600" />;
      default:
        return <Clock size={16} className="text-gray-600" />;
    }
  };

  // Get payment status icon
  const getPaymentIcon = (status) => {
    return status === "paid" ? (
      <CheckCircle size={16} className="text-green-600" />
    ) : (
      <Clock size={16} className="text-orange-500" />
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-4 sm:p-6 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 text-center">
          <h1
            className="text-3xl sm:text-4xl font-bold mb-2 flex items-center justify-center gap-3"
            style={{ color: primaryColor }}
          >
            <Package size={36} /> My Orders
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Track and manage all your orders in one place
          </p>
        </div>

        {!user ? (
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-3 text-gray-800">
              Please login to view your orders
            </h2>
            <button
              className="px-6 py-3 rounded-lg font-medium text-white transition-all hover:opacity-90"
              style={{ backgroundColor: primaryColor }}
              onClick={() => (window.location.href = "/login")}
            >
              Go to Login
            </button>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center max-w-2xl mx-auto">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-orange-100 flex items-center justify-center">
              <Package size={48} style={{ color: primaryColor }} />
            </div>
            <h2 className="text-2xl font-bold mb-3 text-gray-800">
              No orders found
            </h2>
            <p className="text-gray-600 mb-6">
              You haven't placed any orders yet. Start shopping to see your
              orders here.
            </p>
            <button
              className="px-6 py-3 rounded-lg font-medium text-white transition-all hover:opacity-90"
              style={{ backgroundColor: primaryColor }}
              onClick={() => (window.location.href = "/products")}
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-2xl shadow-md overflow-hidden border border-orange-100 hover:shadow-lg transition-all duration-300"
              >
                <div className="p-5 sm:p-6 border-b border-orange-100 flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-bold text-gray-800">
                        Order ID:{" "}
                        <span
                          className="font-mono"
                          style={{ color: primaryColor }}
                        >
                          {order._id}
                        </span>
                      </h3>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar size={16} />
                      <span>
                        Placed on:{" "}
                        {dayjs(order.createdAt).format("DD MMM YYYY, hh:mm A")}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDownloadInvoice(order._id)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-white transition-all hover:opacity-90 self-start sm:self-auto"
                    style={{ backgroundColor: primaryColor }}
                  >
                    <FileDown size={16} /> Download Invoice
                  </button>
                </div>

                <div className="p-5 sm:p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                    {order.items.map((item) => (
                      <div
                        key={item._id}
                        className="border border-orange-100 rounded-xl p-4 flex gap-4 items-center bg-orange-50 hover:bg-orange-100 transition-colors"
                      >
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded-lg border border-orange-200"
                          />
                        ) : (
                          <div className="w-16 h-16 bg-orange-200 rounded-lg flex items-center justify-center text-orange-500">
                            🖼️
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-800 truncate">
                            {item.name}
                          </p>
                          <p className="text-sm text-gray-600">
                            Qty: {item.quantity} × ₹{item.discountPrice}
                          </p>
                          <p
                            className="text-sm font-semibold"
                            style={{ color: primaryColor }}
                          >
                            ₹{item.subtotal}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-orange-100 pt-4 flex flex-col sm:flex-row justify-between gap-4">
                    <div className="flex flex-col sm:flex-row gap-4 sm:gap-8">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-700">
                          Order Status:
                        </span>
                        <div className="flex items-center gap-1">
                          {getStatusIcon(order.orderStatus)}
                          <span
                            className={`font-semibold ${
                              order.orderStatus === "processing"
                                ? "text-yellow-600"
                                : order.orderStatus === "completed"
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {order.orderStatus
                              .charAt(0)
                              .toUpperCase() +
                              order.orderStatus.slice(1)}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-700">
                          Payment:
                        </span>
                        <div className="flex items-center gap-1">
                          {getPaymentIcon(order.paymentStatus)}
                          <span
                            className={`font-semibold ${
                              order.paymentStatus === "paid"
                                ? "text-green-600"
                                : "text-orange-500"
                            }`}
                          >
                            {order.paymentStatus
                              .charAt(0)
                              .toUpperCase() +
                              order.paymentStatus.slice(1)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-700">
                        Grand Total:
                      </span>
                      <span
                        className="text-xl font-bold"
                        style={{ color: primaryColor }}
                      >
                        ₹{order.grandTotal.toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Create a wrapper component with Suspense boundary
const OrdersPageWrapper = () => {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col justify-center items-center h-[60vh]">
          <Loader2 className="animate-spin" size={48} style={{ color: "#943900" }} />
          <p className="mt-4 text-lg font-medium" style={{ color: "#943900" }}>
            Loading your orders...
          </p>
        </div>
      }
    >
      <OrdersPage />
    </Suspense>
  );
};

export default OrdersPageWrapper;