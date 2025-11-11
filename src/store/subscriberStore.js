import { create } from "zustand";
import toast from "react-hot-toast";

// ✅ Define your base URL once here
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const useSubscriberStore = create((set, get) => ({
  subscribers: [],
  loading: false,
  token: typeof window !== "undefined" ? localStorage.getItem("token") : null,

  // ✅ Internal helper: Get valid headers with token
  getAuthHeaders: () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("⚠️ You must be logged in to perform this action.");
      throw new Error("Token missing");
    }
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  },

  // ✅ Fetch all subscribers (Protected)
  fetchSubscribers: async () => {
    try {
      set({ loading: true });

      const headers = get().getAuthHeaders();
      const res = await fetch(`${BASE_URL}/subscribers`, { headers });

      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const data = await res.json();

      if (data.success) {
        set({ subscribers: data.subscribers });
      } else {
        toast.error(data.message || "Failed to fetch subscribers");
      }
    } catch (error) {
      console.error("Fetch Subscribers Error:", error.message);
      toast.error(error.message.includes("Token") ? "Unauthorized access" : "Server error fetching subscribers");
    } finally {
      set({ loading: false });
    }
  },

  // ✅ Add a new subscriber (Public)
  addSubscriber: async (email, phone) => {
    try {
      set({ loading: true });

      const res = await fetch(`${BASE_URL}/subscribers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, phone }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Subscriber added successfully");
        get().fetchSubscribers();
      } else {
        toast.error(data.message || "Unable to add subscriber");
      }
    } catch (error) {
      console.error("Add Subscriber Error:", error.message);
      toast.error("Failed to add subscriber");
    } finally {
      set({ loading: false });
    }
  },

  // ✅ Delete a subscriber (Protected)
  deleteSubscriber: async (id) => {
    try {
      set({ loading: true });

      const headers = get().getAuthHeaders();
      const res = await fetch(`${BASE_URL}/subscribers/${id}`, {
        method: "DELETE",
        headers,
      });

      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const data = await res.json();

      if (data.success) {
        toast.success("Subscriber deleted");
        set({
          subscribers: get().subscribers.filter((s) => s._id !== id),
        });
      } else {
        toast.error(data.message || "Failed to delete subscriber");
      }
    } catch (error) {
      console.error("Delete Subscriber Error:", error.message);
      toast.error(error.message.includes("Token") ? "Unauthorized access" : "Server error deleting subscriber");
    } finally {
      set({ loading: false });
    }
  },
}));
