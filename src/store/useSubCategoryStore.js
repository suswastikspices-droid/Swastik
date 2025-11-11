import { create } from "zustand";
import axios from "axios";

const API_BASE = `${process.env.NEXT_PUBLIC_API_BASE_URL}/subcategories`;

export const useSubCategoryStore = create((set, get) => ({
  subCategories: [],
  selectedSubCategory: null,
  loading: false,
  error: null,
  successMessage: null,

  // ============================
  // FETCH ALL SUBCATEGORIES
  // ============================
fetchSubCategories: async () => {
  set({ loading: true, error: null });
  try {
    const response = await axios.get(API_BASE); // no token
    set({ subCategories: response.data, loading: false });
  } catch (err) {
    set({
      error: err.response?.data?.message || err.message,
      loading: false,
    });
  }
},


  // ============================
  // FETCH SINGLE SUBCATEGORY BY ID
  // ============================
fetchSubCategoryByCategorySlug: async (slug) => {
  set({ loading: true, error: null });
  try {
    const token = localStorage.getItem("token");
    const config = { headers: { Authorization: token ? `Bearer ${token}` : "" } };

    const response = await axios.get(`${API_BASE}/${slug}`, config);
    // assuming your backend route: /subcategories/category/:slug
    const subCategories = response.data.data; // array of subcategories



    set({ subCategories, loading: false }); 
    return { success: true, data: subCategories };
  } catch (err) {
    const errorMsg = err.response?.data?.message || err.message;
    set({ error: errorMsg, loading: false });
    return { success: false, error: errorMsg };
  }
},



  // ============================
  // CREATE SUBCATEGORY
  // ============================
  createSubCategory: async (formData) => {
    set({ loading: true, error: null, successMessage: null });
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
          "Content-Type": "multipart/form-data",
        },
      };

      const response = await axios.post(API_BASE, formData, config);
      set((state) => ({
        subCategories: [response.data, ...state.subCategories],
        loading: false,
        successMessage: "SubCategory created successfully!",
      }));

      return { success: true, data: response.data };
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message;
      set({ error: errorMsg, loading: false });
      return { success: false, error: errorMsg };
    }
  },

  // ============================
  // UPDATE SUBCATEGORY
  // ============================
  updateSubCategory: async (id, formData) => {
    set({ loading: true, error: null, successMessage: null });
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
          "Content-Type": "multipart/form-data",
        },
      };

      const response = await axios.put(`${API_BASE}/${id}`, formData, config);
      set((state) => ({
        subCategories: state.subCategories.map((sub) =>
          sub._id === id ? response.data : sub
        ),
        selectedSubCategory:
          state.selectedSubCategory?._id === id
            ? response.data
            : state.selectedSubCategory,
        loading: false,
        successMessage: "SubCategory updated successfully!",
      }));

      return { success: true, data: response.data };
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message;
      set({ error: errorMsg, loading: false });
      return { success: false, error: errorMsg };
    }
  },

  // ============================
  // DELETE SUBCATEGORY
  // ============================
  deleteSubCategory: async (id) => {
    set({ loading: true, error: null, successMessage: null });
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: { Authorization: token ? `Bearer ${token}` : "" },
      };

      await axios.delete(`${API_BASE}/${id}`, config);
      set((state) => ({
        subCategories: state.subCategories.filter((sub) => sub._id !== id),
        selectedSubCategory:
          state.selectedSubCategory?._id === id
            ? null
            : state.selectedSubCategory,
        loading: false,
        successMessage: "SubCategory deleted successfully!",
      }));

      return { success: true };
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message;
      set({ error: errorMsg, loading: false });
      return { success: false, error: errorMsg };
    }
  },

  // ============================
  // TOGGLE SUBCATEGORY STATUS
  // ============================
  toggleSubCategoryStatus: async (id) => {
    const subCategory = get().subCategories.find((sub) => sub._id === id);
    if (!subCategory) return { success: false, error: "SubCategory not found" };

    const formData = new FormData();
    formData.append("isActive", !subCategory.isActive);

    return await get().updateSubCategory(id, formData);
  },

  // ============================
  // SEARCH / FILTER SUBCATEGORIES
  // ============================
  searchSubCategories: (searchTerm) => {
    const allSubCategories = get().subCategories;
    if (!searchTerm.trim()) return allSubCategories;

    return allSubCategories.filter(
      (sub) =>
        sub.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sub.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  },

  // ============================
  // UTILITIES
  // ============================
  setSelectedSubCategory: (subCategory) =>
    set({ selectedSubCategory: subCategory }),

  clearError: () => set({ error: null }),

  clearSuccess: () => set({ successMessage: null }),

  clearMessages: () => set({ error: null, successMessage: null }),

  reset: () =>
    set({
      subCategories: [],
      selectedSubCategory: null,
      loading: false,
      error: null,
      successMessage: null,
    }),
}));
