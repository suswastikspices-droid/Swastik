"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import BlogForm from "../../components/BlogForm";

export default function CreateBlog() {
  const router = useRouter();

  useEffect(() => {
    // Check for authentication token
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login to create a blog.");
      router.push("/login");
    }
  }, [router]);

  const handleSubmit = async (form) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Unauthorized! Please log in again.");
        router.push("/login");
        return;
      }

      const fd = new FormData();
      fd.append("title", form.title);
      fd.append("author", form.author);
      fd.append("category", form.category);
      fd.append("tags", form.tags);
      fd.append("isPublished", form.isPublished);
      fd.append("htmlContent", form.htmlContent);

      // Store content as JSON (for Editor.js or similar)
      fd.append(
        "content",
        JSON.stringify({
          time: Date.now(),
          blocks: [{ type: "paragraph", data: { text: form.htmlContent } }],
        })
      );

      if (form.image) fd.append("image", form.image);

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/blogs`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`, // ✅ secure token header
        },
        body: fd,
      });

      const data = await res.json();

      if (res.ok && data.success) {
        
        router.push("/admin/blogs"); // redirect after success
      } else {
        alert("❌ Failed: " + (data.message || "Unknown error"));
        console.error("Response:", data);
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Something went wrong. Check console.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-semibold mb-6 text-[#BB4D00]">📝 Create Blog</h1>
      <BlogForm onSubmit={handleSubmit} />
    </div>
  );
}
