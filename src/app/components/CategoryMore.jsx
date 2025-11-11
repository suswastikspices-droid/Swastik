"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Clock, Package, Share2, AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";

const ProductMore = ({ params }) => {
  const router = useRouter();
  const { ProductSlug } = params;
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!ProductSlug) return;

    const fetchData = async () => {
      try {
        const res = await fetch(
          "http://localhost:5000/api/products/all"
        );
        const data = await res.json();

        if (data && data.products) {
          const foundProduct = data.products.find((p) => p.slug === ProductSlug);
          setProduct(foundProduct || null);

          if (foundProduct?.subCategory?._id) {
            const related = data.products.filter(
              (p) =>
                p.subCategory?._id === foundProduct.subCategory._id &&
                p.slug !== ProductSlug
            );
            setRelatedProducts(related);
          }
        }
      } catch (err) {
        console.error("Error loading product:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [ProductSlug]);

  const handleShare = async () => {
    if (!product) return;
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: `Check out this product: ${product.name}`,
          url: window.location.href,
        });
      } catch (err) {
        console.error("Share failed:", err);
      }
    } else {
      await navigator.clipboard.writeText(window.location.href);
      alert("🔗 Link copied to clipboard!");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-[50vh] text-gray-500 text-lg">
        Loading product details...
      </div>
    );

  if (!product)
    return (
      <div className="text-center text-gray-500 py-12 text-lg">
        Product not found.
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* Product Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-3 sm:mb-0">
          {product.name}
        </h1>
        <button
          onClick={handleShare}
          className="flex items-center gap-2 text-sm bg-orange-500 text-white px-4 py-2 rounded-full hover:bg-orange-600 transition-all shadow-sm"
        >
          <Share2 className="w-4 h-4" /> Share
        </button>
      </div>

      {/* Storage & Allergen Info */}
      {(product.shelfLife ||
        product.storageInstructions ||
        product.allergenInfo) && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-orange-100 mb-8">
          <h3 className="font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-orange-500" />
            Storage & Ingredients Info
          </h3>
          <div className="space-y-3 text-sm">
            {product.shelfLife && (
              <div className="flex justify-between">
                <span className="text-gray-600">Shelf Life</span>
                <span className="font-medium text-gray-800">
                  {product.shelfLife}
                </span>
              </div>
            )}
            {product.storageInstructions && (
              <div className="flex justify-between">
                <span className="text-gray-600">Storage</span>
                <span className="font-medium text-gray-800">
                  {product.storageInstructions}
                </span>
              </div>
            )}
            {product.allergenInfo && (
              <div className="flex justify-between">
                <span className="text-gray-600">Allergens</span>
                <span className="font-medium flex items-center text-gray-800">
                  <AlertTriangle className="w-4 h-4 text-red-500 mr-1" />
                  {product.allergenInfo}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Nutritional Info */}
      {product.nutritionalInfo && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-orange-100">
          <h3 className="font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
            <Package className="w-5 h-5 text-orange-500" />
            Nutritional Information
          </h3>
          <div className="space-y-3 text-sm">
            {product.nutritionalInfo.per && (
              <div className="flex justify-between">
                <span className="text-gray-600">Per</span>
                <span className="font-medium text-gray-800">
                  {product.nutritionalInfo.per}
                </span>
              </div>
            )}
            {Array.isArray(product.nutritionalInfo.values) &&
              product.nutritionalInfo.values.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between border-b border-orange-100 pb-2"
                >
                  <span className="text-gray-600 capitalize">{item.name}</span>
                  <span className="font-medium text-gray-800">{item.value}</span>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-12">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">
            More from{" "}
            <span className="text-orange-500">
              {product.subCategory?.name}
            </span>
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {relatedProducts.map((item) => (
              <div
                key={item._id}
                onClick={() => router.push(`/products/${item.slug}`)}
                className="cursor-pointer bg-white border border-orange-100 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-200"
              >
                <div className="relative w-full h-40">
                  <Image
                    src={item.images?.[0] || "/placeholder.png"}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-3">
                  <h4 className="text-sm font-medium text-gray-800 truncate">
                    {item.name}
                  </h4>
                  <p className="text-gray-500  mt-1">
                    {item.shortdescription}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductMore;
