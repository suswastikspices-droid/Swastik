"use client";

import { create } from "zustand";
import toast from "react-hot-toast";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const useDistributorStore = create((set, get) => ({
  distributors: [],
  loading: false,
  error: null,

  // ✅ Fetch all distributors (Admin, Seller, Manager)
  fetchDistributors: async () => {
    const token = localStorage.getItem("token");
    if (!token) return toast.error("Unauthorized access. Please log in.");

    try {
      set({ loading: true });
      const response = await fetch(`${API_BASE}/api/distributors`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();

      if (response.ok) {
        set({ distributors: data.data || [], loading: false });
      } else {
        toast.error(data.message || "Failed to fetch distributors");
        set({ loading: false });
      }
    } catch (error) {
      console.error("Error fetching distributors:", error);
      set({ error, loading: false });
      toast.error("Server error while fetching distributors");
    }
  },

  // ✅ Create Distributor (Public)
  createDistributor: async (formData) => {
    try {
      set({ loading: true });
      const response = await fetch(`${API_BASE}/api/distributors`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        toast.success("Distributor request submitted successfully!");
        set({ loading: false });
        return true;
      } else {
        toast.error(data.message || "Failed to submit distributor request");
        set({ loading: false });
        return false;
      }
    } catch (error) {
      console.error("Error creating distributor:", error);
      toast.error("Network error while submitting request");
      set({ loading: false });
      return false;
    }
  },

  // ❌ Delete distributor (Admin, Seller, Manager)
  deleteDistributor: async (id) => {
    const token = localStorage.getItem("token");
    if (!token) return toast.error("Unauthorized access. Please log in.");

    if (!confirm("Are you sure you want to delete this distributor?")) return;

    try {
      set({ loading: true });
      const response = await fetch(`${API_BASE}/api/distributors/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      if (response.ok) {
        toast.success("Distributor deleted successfully!");
        set({
          distributors: get().distributors.filter((item) => item._id !== id),
          loading: false,
        });
      } else {
        toast.error(data.message || "Failed to delete distributor");
        set({ loading: false });
      }
    } catch (error) {
      console.error("Error deleting distributor:", error);
      toast.error("Server error while deleting distributor");
      set({ loading: false });
    }
  },
}));

export default useDistributorStore;
