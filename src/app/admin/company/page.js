"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_BASE = "http://localhost:5000/api/company";

export default function CompanyManagement() {
  const [companies, setCompanies] = useState([]);
  const [currentView, setCurrentView] = useState("list"); // 'list' or 'form'
  const [editMode, setEditMode] = useState(false);
  const [editingCompanyId, setEditingCompanyId] = useState(null);
  const [apiSuccess, setApiSuccess] = useState(false); // Track API success
  
  const [formData, setFormData] = useState({
    name: "",
    logo: "",
    email: "",
    phone: "",
    address: {
      street: "",
      city: "",
      state: "",
      country: "",
      postalCode: "",
    },
    gstNumber: "",
    website: "",
    invoiceNote: "",
    registrationYear: "",
    directors: [{ name: "", designation: "Director" }],
    businessType: "",
    socialLinks: [{ logoimage: "", social: "", link: "" }],
  });

  const [logoFile, setLogoFile] = useState(null);
  const [socialFiles, setSocialFiles] = useState({});
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // ✅ Get token from your auth context or state management
  const [token, setToken] = useState("");
  
  useEffect(() => {
    const authToken = localStorage.getItem("token");
    setToken(authToken);
  }, []);

  // 🔹 Fetch all companies
  const fetchCompanies = async () => {
    if (!token) return;
    
    try {
      const res = await axios.get(API_BASE, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCompanies(res.data.companies || []);
      setApiSuccess(true); // Mark API as successful
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch companies");
      setApiSuccess(false); // Mark API as failed
    }
  };

  useEffect(() => {
    if (token) {
      fetchCompanies();
    }
  }, [token]);

  // 🔹 Load company data for editing
  const loadCompanyForEdit = (company) => {
    setEditMode(true);
    setEditingCompanyId(company._id);
    setFormData({
      name: company.name || "",
      logo: company.logo || "",
      email: company.email || "",
      phone: company.phone || "",
      address: company.address || {
        street: "",
        city: "",
        state: "",
        country: "",
        postalCode: "",
      },
      gstNumber: company.gstNumber || "",
      website: company.website || "",
      invoiceNote: company.invoiceNote || "",
      registrationYear: company.registrationYear || "",
      directors: company.directors?.length > 0 
        ? company.directors 
        : [{ name: "", designation: "Director" }],
      businessType: company.businessType || "",
      socialLinks: company.socialLinks?.length > 0 
        ? company.socialLinks 
        : [{ logoimage: "", social: "", link: "" }],
    });
    setCurrentView("form");
  };

  // 🔹 Delete company
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this company?")) {
      return;
    }

    try {
      await axios.delete(`${API_BASE}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Company deleted successfully");
      fetchCompanies();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to delete company");
    }
  };

  // 🔹 Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setErrors(prev => ({ ...prev, [name]: "" }));
    
    if (name.startsWith("address.")) {
      const key = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        address: { ...prev.address, [key]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // 🔹 Handle directors
  const handleDirectorChange = (index, field, value) => {
    const updated = [...formData.directors];
    updated[index][field] = value;
    setFormData({ ...formData, directors: updated });
  };

  const addDirector = () => {
    setFormData({
      ...formData,
      directors: [...formData.directors, { name: "", designation: "Director" }],
    });
  };

  const removeDirector = (index) => {
    if (formData.directors.length > 1) {
      const updated = formData.directors.filter((_, i) => i !== index);
      setFormData({ ...formData, directors: updated });
    }
  };

  // 🔹 Handle social links
  const handleSocialChange = (index, field, value) => {
    const updated = [...formData.socialLinks];
    updated[index][field] = value;
    setFormData({ ...formData, socialLinks: updated });
  };

  const handleSocialFileChange = (index, file) => {
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Social icon must be less than 5MB");
        return;
      }
      if (!file.type.startsWith('image/')) {
        toast.error("Only image files are allowed");
        return;
      }
      setSocialFiles((prev) => ({ ...prev, [index]: file }));
    }
  };

  const addSocialLink = () => {
    setFormData({
      ...formData,
      socialLinks: [
        ...formData.socialLinks,
        { logoimage: "", social: "", link: "" },
      ],
    });
  };

  const removeSocialLink = (index) => {
    if (formData.socialLinks.length > 1) {
      const updated = formData.socialLinks.filter((_, i) => i !== index);
      setFormData({ ...formData, socialLinks: updated });
      
      const newSocialFiles = { ...socialFiles };
      delete newSocialFiles[index];
      setSocialFiles(newSocialFiles);
    }
  };

  // 🔹 Logo Upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, logo: "File size must be less than 5MB" }));
        return;
      }
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({ ...prev, logo: "Only image files are allowed" }));
        return;
      }
      setLogoFile(file);
      setErrors(prev => ({ ...prev, logo: "" }));
    }
  };

  // 🔹 Validation
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = "Company name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!formData.phone.trim()) newErrors.phone = "Phone is required";
    if (!formData.address.street.trim()) newErrors["address.street"] = "Street is required";
    if (!formData.address.city.trim()) newErrors["address.city"] = "City is required";
    if (!formData.address.state.trim()) newErrors["address.state"] = "State is required";
    if (!formData.address.country.trim()) newErrors["address.country"] = "Country is required";
    if (!formData.address.postalCode.trim()) newErrors["address.postalCode"] = "Postal code is required";
    
    if (formData.website && !/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/.test(formData.website)) {
      newErrors.website = "Invalid website URL";
    }
    
    if (formData.registrationYear) {
      const year = parseInt(formData.registrationYear);
      if (year < 1800 || year > new Date().getFullYear()) {
        newErrors.registrationYear = "Invalid year";
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 🔹 Reset Form
  const resetForm = () => {
    setFormData({
      name: "",
      logo: "",
      email: "",
      phone: "",
      address: {
        street: "",
        city: "",
        state: "",
        country: "",
        postalCode: "",
      },
      gstNumber: "",
      website: "",
      invoiceNote: "",
      registrationYear: "",
      directors: [{ name: "", designation: "Director" }],
      businessType: "",
      socialLinks: [{ logoimage: "", social: "", link: "" }],
    });
    setLogoFile(null);
    setSocialFiles({});
    setErrors({});
    setEditMode(false);
    setEditingCompanyId(null);
  };

  // 🔹 Submit Form
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix all validation errors");
      return;
    }

    const form = new FormData();
    for (let key in formData) {
      if (key === "address" || key === "directors" || key === "socialLinks") {
        form.append(key, JSON.stringify(formData[key]));
      } else {
        form.append(key, formData[key]);
      }
    }

    if (logoFile) form.append("logo", logoFile);

    Object.entries(socialFiles).forEach(([index, file]) => {
      form.append(`socialIcon_${index}`, file);
    });

    try {
      setLoading(true);
      const res = await axios.post(`${API_BASE}/create`, form, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success(res.data.message);
      resetForm();
      fetchCompanies();
      setCurrentView("list");
    } catch (error) {
      console.error(error);
      const errorMsg = error.response?.data?.message || "Failed to save company details";
      toast.error(errorMsg);
      if (error.response?.status === 401) {
        toast.error("Please login again");
      }
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Cancel Edit
  const handleCancel = () => {
    resetForm();
    setCurrentView("list");
  };

  // ================== RENDER LIST VIEW ==================
  if (currentView === "list") {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">Company Management</h2>
          {/* Conditionally render the button based on API success and company count */}
          {!apiSuccess || companies.length === 0 ? (
            <button
              onClick={() => {
                resetForm();
                setCurrentView("form");
              }}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
            >
              + Add New Company
            </button>
          ) : null}
        </div>

        {companies.length === 0 ? (
          <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">No companies found</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by creating a new company.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {companies.map((company) => (
              <div
                key={company._id}
                className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow p-6"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    {/* Logo */}
                    {company.logo && (
                      <img
                        src={company.logo}
                        alt={company.name}
                        className="w-20 h-20 object-contain rounded-md border border-gray-200"
                      />
                    )}
                    
                    {/* Company Details */}
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900">{company.name}</h3>
                      
                      <div className="mt-2 space-y-1">
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Email:</span> {company.email}
                        </p>
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Phone:</span> {company.phone}
                        </p>
                        {company.address && (
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Address:</span>{" "}
                            {company.address.street}, {company.address.city},{" "}
                            {company.address.state}, {company.address.country} -{" "}
                            {company.address.postalCode}
                          </p>
                        )}
                        {company.gstNumber && (
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">GST:</span> {company.gstNumber}
                          </p>
                        )}
                        {company.website && (
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Website:</span>{" "}
                            <a
                              href={company.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              {company.website}
                            </a>
                          </p>
                        )}
                      </div>

                      {/* Directors */}
                      {company.directors && company.directors.length > 0 && (
                        <div className="mt-3">
                          <p className="text-sm font-medium text-gray-700">Directors:</p>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {company.directors.map((dir, idx) => (
                              <span
                                key={idx}
                                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                              >
                                {dir.name} - {dir.designation}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Social Links */}
                      {company.socialLinks && company.socialLinks.length > 0 && (
                        <div className="mt-3">
                          <p className="text-sm font-medium text-gray-700">Social Links:</p>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {company.socialLinks.map((social, idx) => (
                              social.link && (
                                <a
                                  key={idx}
                                  href={social.link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center space-x-1 text-sm text-gray-600 hover:text-blue-600"
                                >
                                  {social.logoimage && (
                                    <img
                                      src={social.logoimage}
                                      alt={social.social}
                                      className="w-5 h-5 object-contain"
                                    />
                                  )}
                                  <span>{social.social}</span>
                                </a>
                              )
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col space-y-2 ml-4">
                    <button
                      onClick={() => loadCompanyForEdit(company)}
                      className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(company._id)}
                      className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // ================== RENDER FORM VIEW ==================
  return (
    <div className="max-w-6xl mx-auto p-6 bg-white shadow-md rounded-xl mt-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">
          {editMode ? "Edit Company" : "Add New Company"}
        </h2>
        <button
          onClick={handleCancel}
          className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
        >
          ← Back to List
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div>
          <label className="block font-medium text-gray-700">
            Company Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`w-full mt-1 p-2 border rounded-md ${errors.name ? 'border-red-500' : ''}`}
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>

        {/* Email & Phone */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-medium text-gray-700">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full mt-1 p-2 border rounded-md ${errors.email ? 'border-red-500' : ''}`}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>
          <div>
            <label className="block font-medium text-gray-700">
              Phone <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={`w-full mt-1 p-2 border rounded-md ${errors.phone ? 'border-red-500' : ''}`}
            />
            {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
          </div>
        </div>

        {/* Address Section */}
        <h3 className="font-semibold text-gray-700 mt-6">Address</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.keys(formData.address).map((key) => (
            <div key={key}>
              <label className="block font-medium text-gray-700 capitalize">
                {key} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name={`address.${key}`}
                value={formData.address[key]}
                onChange={handleChange}
                className={`w-full mt-1 p-2 border rounded-md ${errors[`address.${key}`] ? 'border-red-500' : ''}`}
              />
              {errors[`address.${key}`] && (
                <p className="text-red-500 text-sm mt-1">{errors[`address.${key}`]}</p>
              )}
            </div>
          ))}
        </div>

        {/* Logo */}
        <div>
          <label className="block font-medium text-gray-700">Company Logo</label>
          {editMode && formData.logo && !logoFile && (
            <div className="mt-2 mb-2">
              <img src={formData.logo} alt="Current logo" className="w-24 h-24 object-contain border rounded" />
              <p className="text-sm text-gray-600 mt-1">Current logo (upload new to replace)</p>
            </div>
          )}
          <input 
            type="file" 
            onChange={handleFileChange}
            accept="image/*"
          />
          {errors.logo && <p className="text-red-500 text-sm mt-1">{errors.logo}</p>}
          {logoFile && (
            <p className="text-sm text-green-600 mt-1">✓ New file: {logoFile.name}</p>
          )}
        </div>

        {/* Directors */}
        <h3 className="font-semibold text-gray-700 mt-6">Directors</h3>
        {formData.directors.map((dir, i) => (
          <div key={i} className="flex gap-4 mb-2">
            <input
              type="text"
              placeholder="Director Name"
              value={dir.name}
              onChange={(e) => handleDirectorChange(i, "name", e.target.value)}
              className="w-1/2 p-2 border rounded-md"
            />
            <input
              type="text"
              placeholder="Designation"
              value={dir.designation}
              onChange={(e) => handleDirectorChange(i, "designation", e.target.value)}
              className="w-1/2 p-2 border rounded-md"
            />
            {formData.directors.length > 1 && (
              <button
                type="button"
                onClick={() => removeDirector(i)}
                className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
              >
                Remove
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={addDirector}
          className="bg-gray-200 px-3 py-1 rounded-md hover:bg-gray-300"
        >
          + Add Director
        </button>

        {/* Social Links */}
        <h3 className="font-semibold text-gray-700 mt-6">Social Links</h3>
        {formData.socialLinks.map((social, i) => (
          <div key={i} className="space-y-2 mb-4 p-4 border rounded-md">
            {editMode && social.logoimage && !socialFiles[i] && (
              <div>
                <img src={social.logoimage} alt="Current icon" className="w-10 h-10 object-contain border rounded" />
                <p className="text-xs text-gray-600">Current icon</p>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Upload Icon</label>
                <input
                  type="file"
                  onChange={(e) => handleSocialFileChange(i, e.target.files[0])}
                  accept="image/*"
                  className="p-2 border rounded-md w-full text-sm"
                />
                {socialFiles[i] && (
                  <p className="text-xs text-green-600 mt-1">✓ {socialFiles[i].name}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Platform</label>
                <input
                  type="text"
                  placeholder="e.g. Facebook"
                  value={social.social}
                  onChange={(e) => handleSocialChange(i, "social", e.target.value)}
                  className="p-2 border rounded-md w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Profile Link</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={social.link}
                  onChange={(e) => handleSocialChange(i, "link", e.target.value)}
                  className="p-2 border rounded-md w-full"
                />
              </div>
            </div>
            {formData.socialLinks.length > 1 && (
              <button
                type="button"
                onClick={() => removeSocialLink(i)}
                className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 text-sm"
              >
                Remove Social Link
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={addSocialLink}
          className="bg-gray-200 px-3 py-1 rounded-md hover:bg-gray-300"
        >
          + Add Social Link
        </button>

        {/* Other Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block font-medium text-gray-700 mb-1">GST Number</label>
            <input
              type="text"
              name="gstNumber"
              value={formData.gstNumber}
              onChange={handleChange}
              placeholder="GST Number"
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block font-medium text-gray-700 mb-1">Website</label>
            <input
              type="text"
              name="website"
              value={formData.website}
              onChange={handleChange}
              placeholder="https://example.com"
              className={`w-full p-2 border rounded-md ${errors.website ? 'border-red-500' : ''}`}
            />
            {errors.website && <p className="text-red-500 text-sm mt-1">{errors.website}</p>}
          </div>
          <div>
            <label className="block font-medium text-gray-700 mb-1">Registration Year</label>
            <input
              type="number"
              name="registrationYear"
              value={formData.registrationYear}
              onChange={handleChange}
              placeholder="e.g. 2020"
              min="1800"
              max={new Date().getFullYear()}
              className={`w-full p-2 border rounded-md ${errors.registrationYear ? 'border-red-500' : ''}`}
            />
            {errors.registrationYear && (
              <p className="text-red-500 text-sm mt-1">{errors.registrationYear}</p>
            )}
          </div>
          <div>
            <label className="block font-medium text-gray-700 mb-1">Business Type</label>
            <select
              name="businessType"
              value={formData.businessType}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
            >
              <option value="">Select Business Type</option>
              <option value="Private Limited">Private Limited</option>
              <option value="Public Limited">Public Limited</option>
              <option value="LLP">LLP</option>
              <option value="Partnership">Partnership</option>
              <option value="Proprietorship">Proprietorship</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        {/* Invoice Note */}
        <div>
          <label className="block font-medium text-gray-700 mb-1">Invoice Note</label>
          <textarea
            name="invoiceNote"
            value={formData.invoiceNote}
            onChange={handleChange}
            placeholder="Thank you for your business!"
            className="w-full p-2 border rounded-md"
            rows="3"
          />
        </div>

        {/* Submit & Cancel Buttons */}
        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? "Saving..." : editMode ? "Update Company" : "Save Company"}
          </button>
          <button
            type="button"
            onClick={resetForm}
            disabled={loading}
            className="bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600 disabled:bg-gray-300"
          >
            Reset Form
          </button>
          <button
            type="button"
            onClick={handleCancel}
            disabled={loading}
            className="bg-gray-400 text-white px-6 py-2 rounded-md hover:bg-gray-500"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}