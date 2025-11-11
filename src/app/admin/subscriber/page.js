"use client";
import React, { useEffect, useState } from "react";
import { useSubscriberStore } from "../../../store/subscriberStore";
import toast from "react-hot-toast";
import { FiTrash2, FiUserPlus, FiUsers } from "react-icons/fi";

const SubscriberDashboard = () => {
  const {
    subscribers,
    fetchSubscribers,
    addSubscriber,
    deleteSubscriber,
    loading,
  } = useSubscriberStore();

  const [formData, setFormData] = useState({ email: "", phone: "" });

  useEffect(() => {
    fetchSubscribers();
  }, [fetchSubscribers]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.email || !formData.phone) {
      toast.error("Please fill all fields");
      return;
    }
    addSubscriber(formData.email, formData.phone);
    setFormData({ email: "", phone: "" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white p-6 font-[Poppins]">
      <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-2xl p-6 border border-orange-100">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-[#BB4D00] flex items-center gap-2">
            <FiUsers className="text-[#BB4D00]" /> Subscribers Dashboard
          </h1>
          <span className="text-gray-500 text-sm mt-2 sm:mt-0">
            Total: {subscribers.length}
          </span>
        </div>

        {/* Add Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-orange-50 p-4 rounded-xl shadow-sm flex flex-col sm:flex-row gap-4 mb-6"
        >
          <input
            type="email"
            name="email"
            placeholder="Email address"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#BB4D00] outline-none"
          />
          <input
            type="tel"
            name="phone"
            placeholder="Phone number"
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#BB4D00] outline-none"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-[#BB4D00] text-white px-5 py-2 rounded-lg flex items-center gap-2 hover:bg-[#a44400] transition-all"
          >
            <FiUserPlus /> Add
          </button>
        </form>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 rounded-xl overflow-hidden">
            <thead className="bg-[#BB4D00] text-white">
              <tr>
                <th className="px-4 py-3 text-left">#</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Phone</th>
                <th className="px-4 py-3 text-left">Date</th>
                <th className="px-4 py-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan="5"
                    className="text-center py-6 text-gray-500 italic"
                  >
                    Loading subscribers...
                  </td>
                </tr>
              ) : subscribers.length > 0 ? (
                subscribers.map((sub, index) => (
                  <tr
                    key={sub._id}
                    className="border-b hover:bg-orange-50 transition-all"
                  >
                    <td className="px-4 py-3">{index + 1}</td>
                    <td className="px-4 py-3">{sub.email}</td>
                    <td className="px-4 py-3">{sub.phone}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {new Date(sub.createdAt).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => deleteSubscriber(sub._id)}
                        className="text-red-600 hover:text-red-800 transition"
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="text-center py-6 text-gray-500 italic"
                  >
                    No subscribers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SubscriberDashboard;
