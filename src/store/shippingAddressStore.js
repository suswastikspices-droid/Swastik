"use client";

import { create } from "zustand";
import axios from "axios";

const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_BASE_URL}`,
  headers: {
    "Content-Type": "application/json",
  },
});

// Automatically attach token if available
api.interceptors.request.use((config) => {
  // Check if window is defined (client-side only)
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Helper function to safely use localStorage
const safeLocalStorage = {
  getItem: (key) => {
    if (typeof window !== "undefined") {
      return localStorage.getItem(key);
    }
    return null;
  },
  setItem: (key, value) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(key, value);
    }
  },
  removeItem: (key) => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(key);
    }
  }
};

export const useShippingAddressStore = create((set, get) => ({
  addresses: [],
  currentAddress: null,
  loading: false,
  message: "",
  error: "",

  // ==========================
  // CREATE NEW ADDRESS
  // ==========================
  createAddress: async (data) => {
    set({ loading: true, message: "", error: "" });
    try {
      const res = await api.post("/shippingaddress", data);
      const newAddress = res.data.data;
      
      set((state) => ({
        addresses: [newAddress, ...state.addresses],
        message: res.data.message || "Address added successfully",
        loading: false,
      }));

      // Save the newly created address ID to localStorage
      safeLocalStorage.setItem("shippingAddressId", newAddress._id);
      
      return { success: true, data: newAddress };
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Error creating address";
      set({
        error: errorMsg,
        loading: false,
      });
      return { success: false, error: errorMsg };
    }
  },

  // ==========================
  // GET ALL ADDRESSES BY USER ID
  // ==========================
  getUserAddresses: async (userId) => {
    if (!userId) {
      console.error("getUserAddresses: userId is required");
      return;
    }

    set({ loading: true, message: "", error: "" });

    try {
      const res = await api.get(`/shippingaddress/user/${userId}`);
      const addresses = res.data.data || [];

      set({ 
        addresses,
        loading: false,
      });

      // Save the first address ID to localStorage (or the default one)
      if (addresses.length > 0) {
        const defaultAddress = addresses.find(addr => addr.isDefault) || addresses[0];
        safeLocalStorage.setItem("shippingAddressId", defaultAddress._id);
        console.log("Saved shippingAddressId to localStorage:", defaultAddress._id);
      } else {
        safeLocalStorage.removeItem("shippingAddressId");
        console.log("No shipping address found, cleared from localStorage");
      }

      return { success: true, data: addresses };
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Error fetching addresses";
      set({
        error: errorMsg,
        loading: false,
      });
      return { success: false, error: errorMsg };
    }
  },

  // ==========================
  // GET SINGLE ADDRESS BY ID
  // ==========================
  getAddressById: async (id) => {
    if (!id) {
      console.error("getAddressById: id is required");
      return;
    }

    set({ loading: true, message: "", error: "" });
    try {
      const res = await api.get(`/shippingaddress/${id}`);
      set({ 
        currentAddress: res.data.data,
        loading: false,
      });
      return { success: true, data: res.data.data };
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Error fetching address";
      set({
        error: errorMsg,
        loading: false,
      });
      return { success: false, error: errorMsg };
    }
  },

  // ==========================
  // UPDATE ADDRESS
  // ==========================
  updateAddress: async (id, updatedData) => {
    if (!id) {
      console.error("updateAddress: id is required");
      return;
    }

    set({ loading: true, message: "", error: "" });
    try {
      const res = await api.put(`/shippingaddress/${id}`, updatedData);
      const updatedAddress = res.data.data;
      
      set((state) => ({
        addresses: state.addresses.map((a) => 
          a._id === id ? updatedAddress : a
        ),
        message: res.data.message || "Address updated successfully",
        loading: false,
      }));

      // Update localStorage if this was the stored address
      const storedId = safeLocalStorage.getItem("shippingAddressId");
      if (storedId === id) {
        safeLocalStorage.setItem("shippingAddressId", updatedAddress._id);
      }

      return { success: true, data: updatedAddress };
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Error updating address";
      set({
        error: errorMsg,
        loading: false,
      });
      return { success: false, error: errorMsg };
    }
  },

  // ==========================
  // DELETE ADDRESS
  // ==========================
  deleteAddress: async (id) => {
    if (!id) {
      console.error("deleteAddress: id is required");
      return;
    }

    set({ loading: true, message: "", error: "" });
    try {
      const res = await api.delete(`/shippingaddress/${id}`);
      
      set((state) => ({
        addresses: state.addresses.filter((a) => a._id !== id),
        message: res.data.message || "Address deleted successfully",
        loading: false,
      }));

      // Remove from localStorage if it was the stored address
      const storedId = safeLocalStorage.getItem("shippingAddressId");
      if (storedId === id) {
        safeLocalStorage.removeItem("shippingAddressId");
      }

      return { success: true };
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Error deleting address";
      set({
        error: errorMsg,
        loading: false,
      });
      return { success: false, error: errorMsg };
    }
  },

  // ==========================
  // GET STORED ADDRESS ID
  // ==========================
  getStoredAddressId: () => {
    return safeLocalStorage.getItem("shippingAddressId");
  },

  // ==========================
  // RESET STORE STATE
  // ==========================
  clearMessages: () => set({ message: "", error: "" }),
  
  resetStore: () => set({ 
    addresses: [], 
    currentAddress: null, 
    loading: false, 
    message: "", 
    error: "" 
  }),
}));