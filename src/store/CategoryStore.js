import { create } from "zustand";
import axios from "axios";

const API_BASE = `${process.env.NEXT_PUBLIC_API_BASE_URL}/categories`;

export const useCategoryStore = create((set, get) => ({
  categories: [],
  selectedCategory: null,
  loading: false,
  error: null,
  successMessage: null,

  // ============================
  // FETCH ALL CATEGORIES
  // ============================
  fetchCategories: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(API_BASE);
      console.log(response)
      set({ categories: response.data, loading: false });
    } catch (err) {
      set({ 
        error: err.response?.data?.message || err.message, 
        loading: false 
      });
    }
  },

  // ============================
  // FETCH SINGLE CATEGORY BY ID
  // ============================
  fetchCategoryById: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`${API_BASE}/${id}`);
      set({ selectedCategory: response.data, loading: false });
    } catch (err) {
      set({ 
        error: err.response?.data?.message || err.message, 
        loading: false 
      });
    }
  },

  // ============================
  // CREATE CATEGORY
  // ============================
  createCategory: async (formData, token) => {
    set({ loading: true, error: null, successMessage: null });
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      };
      const response = await axios.post(API_BASE, formData, config);
      set((state) => ({
        categories: [response.data, ...state.categories],
        loading: false,
        successMessage: "Category created successfully!",
      }));
      return { success: true, data: response.data };
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message;
      set({ error: errorMsg, loading: false });
      return { success: false, error: errorMsg };
    }
  },

  // ============================
  // UPDATE CATEGORY
  // ============================
  updateCategory: async (id, formData, token) => {
    set({ loading: true, error: null, successMessage: null });
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      };
      const response = await axios.put(`${API_BASE}/${id}`, formData, config);
      set((state) => ({
        categories: state.categories.map((cat) =>
          cat._id === id ? response.data : cat
        ),
        selectedCategory: state.selectedCategory?._id === id 
          ? response.data 
          : state.selectedCategory,
        loading: false,
        successMessage: "Category updated successfully!",
      }));
      return { success: true, data: response.data };
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message;
      set({ error: errorMsg, loading: false });
      return { success: false, error: errorMsg };
    }
  },

  // ============================
  // DELETE CATEGORY
  // ============================
  deleteCategory: async (id, token) => {
    set({ loading: true, error: null, successMessage: null });
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      await axios.delete(`${API_BASE}/${id}`, config);
      set((state) => ({
        categories: state.categories.filter((cat) => cat._id !== id),
        selectedCategory: state.selectedCategory?._id === id 
          ? null 
          : state.selectedCategory,
        loading: false,
        successMessage: "Category deleted successfully!",
      }));
      return { success: true };
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message;
      set({ error: errorMsg, loading: false });
      return { success: false, error: errorMsg };
    }
  },

  // ============================
  // TOGGLE CATEGORY STATUS
  // ============================
  toggleCategoryStatus: async (id, token) => {
    const category = get().categories.find(cat => cat._id === id);
    if (!category) return { success: false, error: "Category not found" };

    const formData = new FormData();
    formData.append('isActive', !category.isActive);

    return await get().updateCategory(id, formData, token);
  },

  // ============================
  // SEARCH/FILTER CATEGORIES
  // ============================
  searchCategories: (searchTerm) => {
    const allCategories = get().categories;
    if (!searchTerm.trim()) return allCategories;
    
    return allCategories.filter(cat => 
      cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cat.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  },

  // ============================
  // UTILITY METHODS
  // ============================
  setSelectedCategory: (category) => set({ selectedCategory: category }),
  
  clearError: () => set({ error: null }),
  
  clearSuccess: () => set({ successMessage: null }),
  
  clearMessages: () => set({ error: null, successMessage: null }),

  // Reset store to initial state
  reset: () => set({
    categories: [],
    selectedCategory: null,
    loading: false,
    error: null,
    successMessage: null,
  }),
}));