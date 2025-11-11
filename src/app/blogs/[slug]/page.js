import Image from "next/image";
import DOMPurify from "isomorphic-dompurify";

// ✅ Fetch the blog data from your backend
async function getBlog(slug) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/blogs/slug/${slug}`, {
    next: { revalidate: 60 }, // Cache for 1 min
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data.data;
}

// ✅ Dynamic SEO Metadata (Server-Side)
export async function generateMetadata({ params }) {
  const blog = await getBlog(params.slug);

  if (!blog) {
    return {
      title: "Blog Not Found | Suswastik Blog",
      description: "Sorry, this blog post could not be found.",
      robots: "noindex, nofollow",
    };
  }

  const metaTitle = `${blog.title || "Suswastik Blog"} | Suswastik Blog`;
  const metaDescription =
    blog.metaDescription ||
    `${blog.title} — Learn more about what makes Suswastik special in taste and purity.`;
  const metaKeywords =
    blog.keywords ||
    "Suswastik, spices, Indian spices, authentic masala, organic products, food brand";
  const metaAuthor = blog.author || "Suswastik Editorial Team";
  const metaPublisher = "Suswastik ";
  const metaImage = blog.image || "/default-blog-image.jpg";
  const metaUrl = `https://www.suswastik.in/blogs/${params.slug}`;

  return {
    title: metaTitle,
    description: metaDescription,
    keywords: metaKeywords,
    authors: [{ name: metaAuthor }],
    publisher: metaPublisher,
    alternates: { canonical: metaUrl },
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      url: metaUrl,
      images: [{ url: metaImage }],
      type: "article",
      siteName: "Suswastik",
    },
    twitter: {
      card: "summary_large_image",
      title: metaTitle,
      description: metaDescription,
      images: [metaImage],
    },
    robots: "index, follow",
  };
}

// ✅ Blog Page Component (Server Rendered)
export default async function BlogDetails({ params }) {
  const blog = await getBlog(params.slug);

  if (!blog)
    return (
      <div className="max-w-3xl mx-auto py-16 text-center text-gray-600">
        <h1 className="text-3xl font-semibold text-red-500 mb-4">
          Blog Not Found
        </h1>
        <p>This article may have been moved or deleted.</p>
      </div>
    );

  const cleanHTML = DOMPurify.sanitize(blog.htmlContent || "");

  return (
    <article className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold text-[#bb4d00] mb-3">{blog.title}</h1>
      <p className="text-gray-600 mb-6">
        By <span className="font-medium">{blog.author}</span> in{" "}
        <span className="italic">{blog.category}</span>
      </p>

      {blog.image && (
        <div className="relative w-full h-[400px] mb-8">
          <Image
            src={blog.image}
            alt={blog.title}
            fill
            className="object-cover rounded-2xl shadow-md"
            priority
          />
        </div>
      )}

      <div
        className="prose prose-lg max-w-none text-gray-800 blog-content list-disc list-inside"
        dangerouslySetInnerHTML={{ __html: cleanHTML }}
      />
    </article>
  );
}
