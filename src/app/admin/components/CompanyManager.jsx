"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

// ✅ Set your backend base URL here
const API_BASE = "http://localhost:5000/api/company"; // ← Change if needed

export default function CompanyManager() {
  const [companies, setCompanies] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    alternatePhone: "",
    website: "",
    tagline: "",
    description: "",
    gstNumber: "",
    panNumber: "",
    cinNumber: "",
    tanNumber: "",
    registrationNumber: "",
    registrationYear: new Date().getFullYear(),
    businessType: "Private Limited",
    invoicePrefix: "INV-",
    currency: "INR",
    invoiceNote: "Thank you for shopping with us!",
    termsAndConditions: "Goods once sold will not be returned or exchanged.",
    logo: null,
    socialLinks: {
      facebook: "",
      instagram: "",
      twitter: "",
      linkedin: "",
      youtube: "",
    },
    address: {
      street: "",
      city: "",
      state: "",
      country: "",
      postalCode: "",
    },
  });
  const [editingCompany, setEditingCompany] = useState(null);
  const [loading, setLoading] = useState(false);

  // ================================
  // Fetch all companies
  // ================================
  const fetchCompanies = async () => {
    try {
      const { data } = await axios.get(`${API_BASE}`);
      setCompanies(data.companies || []);
    } catch (err) {
      console.error("Error fetching companies:", err);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  // ================================
  // Handle Input Changes
  // ================================
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("socialLinks.")) {
      const key = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        socialLinks: { ...prev.socialLinks, [key]: value },
      }));
    } else if (name.startsWith("address.")) {
      const key = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        address: { ...prev.address, [key]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // ================================
  // Handle File Change (Logo)
  // ================================
  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, logo: e.target.files[0] }));
  };

  // ================================
  // Handle Submit (Create/Update)
  // ================================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      for (const key in formData) {
        if (key === "socialLinks" || key === "address") {
          formDataToSend.append(key, JSON.stringify(formData[key]));
        } else {
          formDataToSend.append(key, formData[key]);
        }
      }

      if (editingCompany) {
        await axios.post(`${API_BASE}/create`, formDataToSend, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Company updated successfully!");
      } else {
        await axios.post(`${API_BASE}/create`, formDataToSend, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Company created successfully!");
      }

      setFormData({
        name: "",
        email: "",
        phone: "",
        alternatePhone: "",
        website: "",
        tagline: "",
        description: "",
        gstNumber: "",
        panNumber: "",
        cinNumber: "",
        tanNumber: "",
        registrationNumber: "",
        registrationYear: new Date().getFullYear(),
        businessType: "Private Limited",
        invoicePrefix: "INV-",
        currency: "INR",
        invoiceNote: "Thank you for shopping with us!",
        termsAndConditions: "Goods once sold will not be returned or exchanged.",
        logo: null,
        socialLinks: {
          facebook: "",
          instagram: "",
          twitter: "",
          linkedin: "",
          youtube: "",
        },
        address: {
          street: "",
          city: "",
          state: "",
          country: "",
          postalCode: "",
        },
      });
      setEditingCompany(null);
      fetchCompanies();
    } catch (err) {
      console.error("Error saving company:", err);
      alert("Error saving company");
    } finally {
      setLoading(false);
    }
  };

  // ================================
  // Handle Edit
  // ================================
  const handleEdit = (company) => {
    setEditingCompany(company._id);
    setFormData({
      ...company,
      logo: null,
    });
  };

  // ================================
  // Handle Delete
  // ================================
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this company?")) return;

    try {
      await axios.delete(`${API_BASE}/${id}`);
      alert("Company deleted successfully");
      fetchCompanies();
    } catch (err) {
      console.error("Error deleting company:", err);
      alert("Error deleting company");
    }
  };

  // ================================
  // Render
  // ================================
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">
        {editingCompany ? "Edit Company" : "Add Company"}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input name="name" placeholder="Company Name" value={formData.name} onChange={handleChange} required className="border p-2 rounded" />
          <input name="email" placeholder="Email" value={formData.email} onChange={handleChange} required className="border p-2 rounded" />
          <input name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} required className="border p-2 rounded" />
          <input name="alternatePhone" placeholder="Alternate Phone" value={formData.alternatePhone} onChange={handleChange} className="border p-2 rounded" />
          <input name="website" placeholder="Website" value={formData.website} onChange={handleChange} className="border p-2 rounded" />
          <input name="tagline" placeholder="Tagline" value={formData.tagline} onChange={handleChange} className="border p-2 rounded" />
        </div>

        <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} className="border p-2 rounded w-full" />

        {/* Address */}
        <h2 className="font-semibold mt-4">Address</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input name="address.street" placeholder="Street" value={formData.address.street} onChange={handleChange} className="border p-2 rounded" />
          <input name="address.city" placeholder="City" value={formData.address.city} onChange={handleChange} className="border p-2 rounded" />
          <input name="address.state" placeholder="State" value={formData.address.state} onChange={handleChange} className="border p-2 rounded" />
          <input name="address.country" placeholder="Country" value={formData.address.country} onChange={handleChange} className="border p-2 rounded" />
          <input name="address.postalCode" placeholder="Postal Code" value={formData.address.postalCode} onChange={handleChange} className="border p-2 rounded" />
        </div>

        {/* Logo Upload */}
        <input type="file" name="logo" onChange={handleFileChange} className="border p-2 rounded w-full" />

        {/* Social Links */}
        <h2 className="font-semibold mt-4">Social Links</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {["facebook", "instagram", "twitter", "linkedin", "youtube"].map((platform) => (
            <input
              key={platform}
              name={`socialLinks.${platform}`}
              placeholder={`${platform} URL`}
              value={formData.socialLinks[platform]}
              onChange={handleChange}
              className="border p-2 rounded"
            />
          ))}
        </div>

        <button type="submit" disabled={loading} className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
          {loading ? "Saving..." : editingCompany ? "Update Company" : "Add Company"}
        </button>
      </form>

      {/* Company List */}
      <h2 className="text-xl font-bold mt-10 mb-4">Company List</h2>
      <div className="space-y-4">
        {companies.map((company) => (
          <div key={company._id} className="border p-4 rounded flex justify-between items-center">
            <div>
              <h3 className="font-semibold">{company.name}</h3>
              <p>{company.email}</p>
              <p>{company.phone}</p>
            </div>
            <div className="space-x-2">
              <button onClick={() => handleEdit(company)} className="bg-yellow-500 text-white px-3 py-1 rounded">
                Edit
              </button>
              <button onClick={() => handleDelete(company._id)} className="bg-red-600 text-white px-3 py-1 rounded">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
