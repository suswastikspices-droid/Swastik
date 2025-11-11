import { create } from "zustand";
import axios from "axios";

const API_URL = "http://localhost:5000/api/categoryCards"; // your backend endpoint

// ✅ Helper: Get token from localStorage
const getToken = () => {
  try {
    return localStorage.getItem("token");
  } catch {
    return null;
  }
};

export const useCategoryStore = create((set, get) => ({
  categories: [],
  loading: false,
  error: null,

  // ✅ Fetch all categories
  fetchCategories: async () => {
    set({ loading: true });
    try {
      const res = await axios.get(API_URL);
      set({ categories: res.data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  // ➕ Add Category (with image)
  addCategory: async (newCategory) => {
    try {
      const token = getToken();
      const formData = new FormData();
      formData.append("name", newCategory.name);
      formData.append("description", newCategory.description);
      formData.append("slug", newCategory.slug);
      formData.append("link", newCategory.link);
      if (newCategory.image) formData.append("image", newCategory.image);

      const res = await axios.post(API_URL, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      set((state) => ({
        categories: [res.data.category, ...state.categories],
      }));
    } catch (error) {
      set({ error: error.message });
    }
  },

  // ✏️ Update Category
  updateCategory: async (id, updatedData) => {
    try {
      const token = getToken();
      const formData = new FormData();
      formData.append("name", updatedData.name);
      formData.append("description", updatedData.description);
      formData.append("slug", updatedData.slug);
      formData.append("link", updatedData.link);
      if (updatedData.image) formData.append("image", updatedData.image);

      const res = await axios.put(`${API_URL}/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      set((state) => ({
        categories: state.categories.map((cat) =>
          cat._id === id ? res.data.category : cat
        ),
      }));
    } catch (error) {
      set({ error: error.message });
    }
  },

  // ❌ Delete Category
  deleteCategory: async (id) => {
    try {
      const token = getToken();
      await axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      set((state) => ({
        categories: state.categories.filter((cat) => cat._id !== id),
      }));
    } catch (error) {
      set({ error: error.message });
    }
  },
}));
