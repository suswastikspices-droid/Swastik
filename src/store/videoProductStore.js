import { create } from "zustand";
import axios from "axios";

const API_URL = "https://swastik-backend-tlka.onrender.com/api/videoproducts";

// 🧠 Helper: Get token from localStorage
const getToken = () => {
  try {
    return localStorage.getItem("token");
  } catch {
    return null;
  }
};

export const useVideoProductStore = create((set, get) => ({
  videoProducts: [],
  loading: false,
  error: null,

  // ✅ Fetch all video products (public)
  fetchVideoProducts: async () => {
    set({ loading: true });
    try {
      const res = await axios.get(API_URL);
      set({ videoProducts: res.data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  // ➕ Add a new video product (requires token)
  addVideoProduct: async (newProduct) => {
    try {
      const formData = new FormData();
      formData.append("title", newProduct.title);
      formData.append("youtubeUrl", newProduct.youtubeUrl);
      formData.append("productUrl", newProduct.productUrl);
      if (newProduct.image) formData.append("image", newProduct.image);

      const token = getToken();
      const res = await axios.post(API_URL, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      set((state) => ({
        videoProducts: [res.data.videoProduct, ...state.videoProducts],
      }));
    } catch (error) {
      set({ error: error.message });
    }
  },

  // ✏️ Update product (requires token)
  updateVideoProduct: async (id, updatedData) => {
    try {
      const formData = new FormData();
      formData.append("title", updatedData.title);
      formData.append("youtubeUrl", updatedData.youtubeUrl);
      formData.append("productUrl", updatedData.productUrl);
      if (updatedData.image) formData.append("image", updatedData.image);

      const token = getToken();
      const res = await axios.put(`${API_URL}/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      set((state) => ({
        videoProducts: state.videoProducts.map((p) =>
          p._id === id ? res.data.videoProduct : p
        ),
      }));
    } catch (error) {
      set({ error: error.message });
    }
  },

  // ❌ Delete product (requires token)
  deleteVideoProduct: async (id) => {
    try {
      const token = getToken();
      await axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      set((state) => ({
        videoProducts: state.videoProducts.filter((p) => p._id !== id),
      }));
    } catch (error) {
      set({ error: error.message });
    }
  },
}));
