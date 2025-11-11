"use client";

import React, { useEffect, useState } from "react";
import { Loader2, PlusCircle, Trash2, RefreshCw } from "lucide-react";
import useDistributorStore from "../../../store/useDistributorStore";

const DistributorDashboard = () => {
  const {
    distributors,
    loading,
    fetchDistributors,
    createDistributor,
    deleteDistributor,
  } = useDistributorStore();

  const [showForm, setShowForm] = useState(false);
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

  useEffect(() => {
    fetchDistributors();
  }, [fetchDistributors]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await createDistributor(formData);
    if (success) {
      setShowForm(false);
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
      fetchDistributors();
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold" style={{ color: themeColor }}>
          Distributor Management
        </h2>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchDistributors}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border hover:bg-gray-100"
          >
            <RefreshCw size={18} /> Refresh
          </button>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 text-white rounded-lg"
            style={{ backgroundColor: themeColor }}
          >
            <PlusCircle size={18} /> Add Distributor
          </button>
        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-10 text-gray-600">
          <Loader2 className="animate-spin mr-2" /> Loading Distributors...
        </div>
      )}

      {!loading && (
        <div className="overflow-x-auto border border-gray-200 rounded-lg">
          <table className="w-full text-sm">
            <thead style={{ backgroundColor: themeColor }} className="text-white">
              <tr>
                <th className="py-2 px-3 text-left">Name</th>
                <th className="py-2 px-3 text-left">Email</th>
                <th className="py-2 px-3 text-left">Mobile</th>
                <th className="py-2 px-3 text-left">City</th>
                <th className="py-2 px-3 text-left">State</th>
                <th className="py-2 px-3 text-left">Association</th>
                <th className="py-2 px-3 text-left">Source</th>
                <th className="py-2 px-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {distributors?.length > 0 ? (
                distributors.map((item) => (
                  <tr
                    key={item._id}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    <td className="py-2 px-3">
                      {item.firstName} {item.lastName}
                    </td>
                    <td className="py-2 px-3">{item.email}</td>
                    <td className="py-2 px-3">{item.mobile}</td>
                    <td className="py-2 px-3">{item.city}</td>
                    <td className="py-2 px-3">{item.state}</td>
                    <td className="py-2 px-3 capitalize">{item.association}</td>
                    <td className="py-2 px-3 capitalize">
                      {item.source || "-"}
                    </td>
                    <td className="py-2 px-3">
                      <button
                        onClick={() => deleteDistributor(item._id)}
                        className="text-red-600 hover:text-red-800 flex items-center gap-1"
                      >
                        <Trash2 size={16} /> Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={8}
                    className="text-center py-6 text-gray-500 italic"
                  >
                    No distributor requests found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white rounded-2xl shadow-lg w-full max-w-2xl p-6 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-3 right-3 bg-red-500 text-white w-8 h-8 rounded-full hover:bg-red-600"
            >
              ×
            </button>

            <h3 className="text-xl font-semibold mb-4" style={{ color: themeColor }}>
              Add New Distributor
            </h3>

            <form onSubmit={handleSubmit} className="space-y-3">
              {["firstName", "lastName", "email", "mobile", "city", "state"].map((field) => (
                <input
                  key={field}
                  type={field === "email" ? "email" : field === "mobile" ? "tel" : "text"}
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  placeholder={`${field.replace(/([A-Z])/g, " $1")} *`}
                  required={["firstName", "email", "mobile", "city", "state"].includes(field)}
                  className="border rounded-md p-2 w-full focus:ring-2 focus:ring-[#943900]"
                />
              ))}

              <select
                name="association"
                value={formData.association}
                onChange={handleChange}
                required
                className="border rounded-md p-2 focus:ring-2 focus:ring-[#943900] w-full"
              >
                <option value="">Select Association *</option>
                <option value="distributor">Distributor</option>
                <option value="retailer">Retailer</option>
                <option value="wholesaler">Wholesaler</option>
              </select>

              <select
                name="source"
                value={formData.source}
                onChange={handleChange}
                className="border rounded-md p-2 focus:ring-2 focus:ring-[#943900] w-full"
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
                placeholder="Additional Comments"
                rows={3}
                className="border rounded-md p-2 w-full focus:ring-2 focus:ring-[#943900]"
              />

              <label className="flex items-start gap-2 text-sm">
                <input
                  type="checkbox"
                  name="agree"
                  checked={formData.agree}
                  onChange={handleChange}
                  className="mt-1 accent-[#943900]"
                />
                I agree to receive updates, newsletters & promotional calls.
              </label>

              <div className="flex justify-end mt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-[#943900] hover:bg-[#772e00] text-white px-6 py-2 rounded-lg shadow-md transition disabled:opacity-70"
                >
                  {loading ? "Submitting..." : "Submit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DistributorDashboard;
