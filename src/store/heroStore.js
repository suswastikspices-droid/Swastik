import { create } from "zustand";
import axios from "axios";

const API_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/hero`;

export const useHeroStore = create((set, get) => ({
  heroImages: [],
  loading: false,
  error: null,

  // 🧠 Helper function to get token from localStorage
  getAuthConfig: () => {
    const token = localStorage.getItem("token");
    return {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
        "Content-Type": "application/json",
      },
    };
  },

  // 🖼️ Fetch Hero Images
  fetchHeroImages: async () => {
    try {
      set({ loading: true, error: null });
      const config = get().getAuthConfig();
      const { data } = await axios.get(API_URL, config);
      set({ heroImages: data, loading: false });
    } catch (err) {
      set({ error: err.response?.data?.message || err.message, loading: false });
    }
  },

  // 📤 Upload Hero Images
  uploadHeroImages: async (formData) => {
    try {
      set({ loading: true, error: null });
      const token = localStorage.getItem("token");
      const { data } = await axios.post(`${API_URL}/upload`, formData, {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
          "Content-Type": "multipart/form-data",
        },
      });
      set((state) => ({
        heroImages: [...state.heroImages, ...data.images],
        loading: false,
      }));
    } catch (err) {
      set({ error: err.response?.data?.message || err.message, loading: false });
      throw err;
    }
  },

  // ❌ Delete Hero Image
  deleteHeroImage: async (id) => {
    try {
      const config = get().getAuthConfig();
      await axios.delete(`${API_URL}/${id}`, config);
      set((state) => ({
        heroImages: state.heroImages.filter((img) => img._id !== id),
      }));
    } catch (err) {
      set({ error: err.response?.data?.message || err.message });
      throw err;
    }
  },

  // 🔄 Update Hero Image
  updateHeroImage: async (id, updates) => {
    try {
      const config = get().getAuthConfig();
      const { data } = await axios.put(`${API_URL}/${id}`, updates, config);
      set((state) => ({
        heroImages: state.heroImages.map((img) =>
          img._id === id ? data : img
        ),
      }));
    } catch (err) {
      set({ error: err.response?.data?.message || err.message });
      throw err;
    }
  },

  // ↕️ Reorder Hero Images
  reorderHeroImages: async (orderIds) => {
    try {
      set({ loading: true, error: null });
      const config = get().getAuthConfig();
      const { data } = await axios.put(`${API_URL}/reorder`, { order: orderIds }, config);
      set({ heroImages: data, loading: false });
    } catch (err) {
      set({ error: err.response?.data?.message || err.message, loading: false });
      throw err;
    }
  },
}));
