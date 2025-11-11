// src/store/useTestimonialStore.js
import { create } from "zustand";

const API_BASE = `${process.env.NEXT_PUBLIC_API_BASE_URL}/testimonials`;

export const useTestimonialStore = create((set, get) => ({
  testimonials: [],
  total: 0,
  page: 1,
  limit: 10,
  loading: false,
  error: null,
  selectedTestimonial: null,
  form: {
    name: "",
    title: "",
    message: "",
    link: "",
    imageFile: null,
    imagePreview: "",
    isActive: true,
    sortOrder: 0,
  },

  // ✅ Merge form updates safely
  setForm: (payload) => set((state) => ({
    form: { ...state.form, ...payload },
  })),

  resetForm: () =>
    set({
      selectedTestimonial: null,
      form: {
        name: "",
        title: "",
        message: "",
        link: "",
        imageFile: null,
        imagePreview: "",
        isActive: true,
        sortOrder: 0,
      },
    }),

  // ✅ Fetch all testimonials
  fetchTestimonials: async () => {
    set({ loading: true });
    try {
      const res = await fetch(`${API_BASE}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      set({
        testimonials: data.data || data,
        total: data.total || data.length,
        loading: false,
      });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  // ✅ Create a testimonial
  createTestimonial: async () => {
    const { form } = get();
    const token = localStorage.getItem("token");

    if (!form.imageFile) {
      set({ error: "Please select an image" });
      return;
    }

    const fd = new FormData();
    fd.append("name", form.name);
    fd.append("title", form.title);
    fd.append("message", form.message);
    fd.append("link", form.link);
    fd.append("isActive", form.isActive);
    fd.append("sortOrder", form.sortOrder);
    fd.append("image", form.imageFile);

    set({ loading: true });
    try {
      const res = await fetch(API_BASE, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      set((state) => ({
        testimonials: [data.testimonial, ...state.testimonials],
        loading: false,
      }));
      get().resetForm();
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  // ✅ Update testimonial
  updateTestimonial: async (id) => {
    const { form } = get();
    const token = localStorage.getItem("token");

    const fd = new FormData();
    fd.append("name", form.name);
    fd.append("title", form.title);
    fd.append("message", form.message);
    fd.append("link", form.link);
    fd.append("isActive", form.isActive);
    fd.append("sortOrder", form.sortOrder);
    if (form.imageFile) fd.append("image", form.imageFile);

    set({ loading: true });
    try {
      const res = await fetch(`${API_BASE}/${id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      set((state) => ({
        testimonials: state.testimonials.map((t) =>
          t._id === id ? data.testimonial : t
        ),
        loading: false,
      }));
      get().resetForm();
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  // ✅ Delete testimonial
  deleteTestimonial: async (id) => {
    const token = localStorage.getItem("token");
    set({ loading: true });
    try {
      const res = await fetch(`${API_BASE}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      set((state) => ({
        testimonials: state.testimonials.filter((t) => t._id !== id),
        loading: false,
      }));
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  // ✅ Select testimonial for editing (fixed)
  selectTestimonial: (testimonial) => {
    set({
      selectedTestimonial: testimonial, // store full object, not just ID
      form: {
        name: testimonial.name || "",
        title: testimonial.title || "",
        message: testimonial.message || "",
        link: testimonial.link || "",
        imageFile: null,
        imagePreview: testimonial.image || "",
        isActive: testimonial.isActive ?? true,
        sortOrder: testimonial.sortOrder ?? 0,
      },
    });
  },
}));
