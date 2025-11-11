"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation"; // ✅ for redirect after submit
import useDistributorStore from "../../store/useDistributorStore";
import toast from "react-hot-toast";

const CustomerDistributorForm = () => {
  const router = useRouter();
  const { createDistributor, loading } = useDistributorStore();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    city: "",
    state: "",
    association: "",
    source: "",
    comments: "",
    agree: false,
  });

  const themeColor = "#943900";

  // ✅ Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // ✅ Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.agree) {
      toast.error("Please agree to receive communications.");
      return;
    }

    const success = await createDistributor(formData);
    if (success) {
      toast.success("Thank you! We'll reach out to you soon.");
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        mobile: "",
        city: "",
        state: "",
        association: "",
        source: "",
        comments: "",
        agree: false,
      });

      // ✅ Redirect to homepage after short delay
      setTimeout(() => {
        router.push("/");
      }, 1500);
    }
  };

  return (
    <section className="bg-gradient-to-br from-amber-50 via-white to-orange-50 py-16 px-4">
      <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-2xl p-8 border-t-4 border-[#943900]">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold" style={{ color: themeColor }}>
            Become a Partner
          </h2>
          <p className="text-gray-600 mt-2 text-sm">
            Please fill in your details and our team will get in touch with you soon.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
              placeholder="First Name *"
              className="border rounded-lg p-3 focus:ring-2 focus:ring-[#943900] outline-none"
            />
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Last Name"
              className="border rounded-lg p-3 focus:ring-2 focus:ring-[#943900] outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Email Address *"
              className="border rounded-lg p-3 focus:ring-2 focus:ring-[#943900] outline-none"
            />
            <input
              type="tel"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              required
              placeholder="Mobile Number *"
              className="border rounded-lg p-3 focus:ring-2 focus:ring-[#943900] outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
              placeholder="City *"
              className="border rounded-lg p-3 focus:ring-2 focus:ring-[#943900] outline-none"
            />
            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleChange}
              required
              placeholder="State *"
              className="border rounded-lg p-3 focus:ring-2 focus:ring-[#943900] outline-none"
            />
          </div>

          <select
            name="association"
            value={formData.association}
            onChange={handleChange}
            required
            className="border rounded-lg p-3 w-full focus:ring-2 focus:ring-[#943900] outline-none"
          >
            <option value="">How you want to associate with us? *</option>
            <option value="distributor">Distributor</option>
            <option value="retailer">Retailer</option>
            <option value="wholesaler">Wholesaler</option>
          </select>

          <select
            name="source"
            value={formData.source}
            onChange={handleChange}
            className="border rounded-lg p-3 w-full focus:ring-2 focus:ring-[#943900] outline-none"
          >
            <option value="">How did you hear about us?</option>
            <option value="social_media">Social Media</option>
            <option value="friend">Friend/Family</option>
            <option value="advertisement">Advertisement</option>
            <option value="website">Website</option>
          </select>

          <textarea
            name="comments"
            value={formData.comments}
            onChange={handleChange}
            placeholder="Additional Comments (Optional)"
            rows={3}
            className="border rounded-lg p-3 w-full focus:ring-2 focus:ring-[#943900] outline-none"
          />

          <label className="flex items-start gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              name="agree"
              checked={formData.agree}
              onChange={handleChange}
              className="mt-1 accent-[#943900]"
            />
            I agree to receive communication on newsletters, promotional content, offers & calls.
          </label>

          <div className="text-center pt-4">
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 text-white font-semibold rounded-lg shadow-md hover:opacity-90 transition disabled:opacity-70"
              style={{ backgroundColor: themeColor }}
            >
              {loading ? "Submitting..." : "Submit Request"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default CustomerDistributorForm;
