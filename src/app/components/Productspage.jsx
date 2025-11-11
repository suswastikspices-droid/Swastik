"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { ShoppingBag, Filter, ShoppingCart, Plus, Minus } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import useCartStore from "../../store/useCartStore";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

const ProductsPage = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantities, setQuantities] = useState({});
  const [updatingItems, setUpdatingItems] = useState({});
  const [showQuantityControls, setShowQuantityControls] = useState({});
  const [showAllProducts, setShowAllProducts] = useState(false);

  const { cart, addItem, updateItem, removeItem, fetchCart, loading: cartLoading } = useCartStore();
 
  const [userId, setUserId] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Load user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("userId");
    const storedToken = localStorage.getItem("token");
    
    if (storedUser && storedToken) {
      try {
        const parsedUser = storedUser;
        setUserId(parsedUser);
        setIsAuthenticated(true);
      } catch (err) {
        console.error("Error parsing user:", err);
        setIsAuthenticated(false);
      }
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  // Convert text to URL-friendly slug
  const toSlug = (text) => text.toLowerCase().replace(/\s+/g, '-');

  // Sync quantities with cart whenever cart changes
  useEffect(() => {
    if (cart?.items?.length > 0) {
      const updatedQuantities = {};
      const updatedControls = {};
      
      cart.items.forEach((item) => {
        updatedQuantities[item.product._id] = item.quantity;
        updatedControls[item.product._id] = true;
      });
      
      setQuantities((prev) => ({ ...prev, ...updatedQuantities }));
      setShowQuantityControls((prev) => ({ ...prev, ...updatedControls }));
    }
  }, [cart]);

  // Fetch products and cart on mount
  useEffect(() => {
    const fetchProductsAndCart = async () => {
      setLoading(true);
      try {
        // Fetch products
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/products/all`);
        const data = await res.json();
        let products = data.products || [];
        
        // Sort products by priorityNumber (descending: 3, 2, 1, 0)
        products.sort((a, b) => {
          const aPriority = a.priorityNumber !== undefined ? a.priorityNumber : 0;
          const bPriority = b.priorityNumber !== undefined ? b.priorityNumber : 0;
          return bPriority - aPriority;
        });
        
        setAllProducts(products);
        setFilteredProducts(products);

        const uniqueSubs = [];
        const seen = new Set();
        products.forEach((p) => {
          if (p.subCategory && !seen.has(p.subCategory._id)) {
            seen.add(p.subCategory._id);
            uniqueSubs.push(p.subCategory);
          }
        });
        setSubCategories(uniqueSubs);

        // Fetch cart only if authenticated
        if (userId && isAuthenticated) {
          await fetchCart(userId);
        }
      } catch (err) {
        console.error("Failed to fetch products/cart:", err);
        toast.error("Failed to fetch products");
      } finally {
        setLoading(false);
      }
    };

    fetchProductsAndCart();
  }, [fetchCart, userId, isAuthenticated]);

  // Handle subcategory filtering from URL query
  useEffect(() => {
    if (subCategories.length > 0) {
      const querySub = searchParams.get('subCategory');
      
      if (querySub) {
        const foundSub = subCategories.find(sub => toSlug(sub.name) === querySub);
        if (foundSub) {
          setSelectedSubCategory(foundSub._id);
        } else {
          setSelectedSubCategory(null);
        }
      } else {
        setSelectedSubCategory(null);
      }
    }
  }, [searchParams, subCategories]);

  // Filter products by subcategory
  useEffect(() => {
    if (!selectedSubCategory) {
      setFilteredProducts(allProducts);
    } else {
      const filtered = allProducts.filter((p) => p.subCategory?._id === selectedSubCategory);
      setFilteredProducts(filtered);
    }
    setShowAllProducts(false);
  }, [selectedSubCategory, allProducts]);

  // Handle filter change and update URL
  const handleFilterChange = (subCategoryId) => {
    if (subCategoryId === null) {
      const params = new URLSearchParams(searchParams.toString());
      params.delete('subCategory');
      const newUrl = `${pathname}${params.toString() ? `?${params.toString()}` : ''}`;
      window.history.pushState({}, '', newUrl);
    } else {
      const sub = subCategories.find(s => s._id === subCategoryId);
      if (sub) {
        const slug = toSlug(sub.name);
        const params = new URLSearchParams(searchParams.toString());
        params.set('subCategory', slug);
        const newUrl = `${pathname}?${params.toString()}`;
        window.history.pushState({}, '', newUrl);
      }
    }
  };

  const handleAddToCart = async (product) => {
    if (!isAuthenticated || !userId) {
      toast.error("Please login to add products to cart");
      return;
    }

    const productId = product._id;
    setUpdatingItems((prev) => ({ ...prev, [productId]: true }));

    try {
      await addItem(userId, productId, 1, {});
      toast.success(`${product.name} added to cart!`);
      setShowQuantityControls((prev) => ({ ...prev, [productId]: true }));
      await fetchCart(userId);
    } catch (err) {
      console.error(err);
      toast.error("Failed to add product to cart");
    } finally {
      setUpdatingItems((prev) => ({ ...prev, [productId]: false }));
    }
  };

  const handleQuantityChange = async (productId, delta) => {
    if (!isAuthenticated || !userId) {
      toast.error("Please login to update cart");
      return;
    }

    const current = quantities[productId] || 1;
    const newQty = current + delta;
    if (newQty < 0) return;

    setQuantities((prev) => ({ ...prev, [productId]: newQty }));
    setUpdatingItems((prev) => ({ ...prev, [productId]: true }));

    try {
      if (newQty === 0) {
        await removeItem(userId, productId);
        setShowQuantityControls((prev) => ({ ...prev, [productId]: false }));
        toast.success("Item removed from cart");
      } else {
        await updateItem(userId, productId, newQty);
        toast.success("Quantity updated!");
      }
      await fetchCart(userId);
    } catch (err) {
      setQuantities((prev) => ({ ...prev, [productId]: current }));
      toast.error("Failed to update quantity");
    } finally {
      setUpdatingItems((prev) => ({ ...prev, [productId]: false }));
    }
  };

  const isInCart = (productId) =>
    cart?.items?.some((item) => item.product._id === productId);

  const totalCartItems = cart?.items?.reduce((total, item) => total + item.quantity, 0) || 0;

  const isMainProductsPage = pathname === "/products" && !searchParams.get('subCategory');

  const displayProducts = showAllProducts ? filteredProducts : filteredProducts.slice(0, 8);

  return (
    <div className="min-h-screen">
      <Toaster position="top-right" />

      <div className="max-w-8xl mx-auto px-4 py-8">
        
        {/* Header - Only show on main products page */}
        {isMainProductsPage && (
        <div className="text-center mb-12">
  {/* 🌶️ Tagline Badge */}
  <div
    className="inline-block px-6 py-2 rounded-full mb-4"
    style={{ backgroundColor: "#c05300" }}
  >
    <span className="font-bold text-white">Pure, Aromatic & Authentic</span>
  </div>

  {/* 🧡 Main Heading */}
  <h1
    className="text-5xl font-bold mb-4"
    style={{ color: "#c05300" }}
  >
    Suswastik Spices Collection
  </h1>

  {/* ✨ Description */}
  <p
    className="max-w-2xl mx-auto text-lg"
    style={{ color: "rgba(192, 83, 0, 0.8)" }}
  >
    Discover the magic of purity and taste with <strong>Suswastik Spices</strong>.  
    Handpicked from the finest farms, roasted to perfection, and packed with care —  
    each blend brings you the true essence of Indian flavors.
  </p>

  {/* 🛒 Cart Button */}
  <div className="mt-8 flex justify-center">
    <div className="relative">
      {totalCartItems > 0 && (
        <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
          {totalCartItems}
        </div>
      )}
      <Link href="/cart" aria-label="View Cart">
        <div
          className="p-4 rounded-full shadow-lg hover:shadow-xl transition cursor-pointer flex items-center gap-2"
          style={{ backgroundColor: "#c05300" }}
        >
          <ShoppingBag className="w-6 h-6 text-white" />
          <span className="text-white font-medium">View Cart</span>
        </div>
      </Link>
    </div>
  </div>
</div>

        )}

        {/* Filter */}
        <div className="bg-white rounded-2xl p-6 mb-10 shadow-sm" style={{ border: '2px solid rgba(192, 83, 0, 0.2)' }}>
          <div className="flex items-center gap-3 flex-wrap justify-center">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full" style={{ backgroundColor: 'rgba(192, 83, 0, 0.1)' }}>
              <Filter className="w-5 h-5" style={{ color: '#c05300' }} />
              <span className="font-medium" style={{ color: '#c05300' }}>Filter by Category:</span>
            </div>
            <button
              onClick={() => handleFilterChange(null)}
              className={`px-6 py-3 rounded-full text-sm font-bold transition-all ${
                selectedSubCategory === null
                  ? "text-white shadow-md"
                  : "hover:bg-opacity-5 border"
              }`}
              style={selectedSubCategory === null 
                ? { backgroundColor: '#c05300' } 
                : { 
                    color: '#c05300', 
                    backgroundColor: 'white',
                    borderColor: 'rgba(192, 83, 0, 0.2)'
                  }
              }
            >
              All Laddus
            </button>
            {subCategories.map((sub) => (
              <button
                key={sub._id}
                onClick={() => handleFilterChange(sub._id)}
                className={`px-6 py-3 rounded-full text-sm font-bold transition-all ${
                  selectedSubCategory === sub._id
                    ? "text-white shadow-md"
                    : "hover:bg-opacity-5 border"
                }`}
                style={selectedSubCategory === sub._id 
                  ? { backgroundColor: '#c05300' } 
                  : { 
                      color: '#c05300', 
                      backgroundColor: 'white',
                      borderColor: 'rgba(192, 83, 0, 0.2)'
                    }
                }
              >
                {sub.name}
              </button>
            ))}
          </div>
        </div>

        {/* Products */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm animate-pulse" style={{ border: '2px solid rgba(192, 83, 0, 0.1)' }}>
                <div style={{ height: '16rem', backgroundColor: 'rgba(192, 83, 0, 0.1)' }}></div>
                <div className="p-5">
                  <div className="h-6 rounded mb-2" style={{ backgroundColor: 'rgba(192, 83, 0, 0.1)' }}></div>
                  <div className="h-4 rounded w-3/4 mb-3" style={{ backgroundColor: 'rgba(192, 83, 0, 0.1)' }}></div>
                  <div className="h-8 rounded" style={{ backgroundColor: 'rgba(192, 83, 0, 0.1)' }}></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-6" style={{ backgroundColor: 'rgba(192, 83, 0, 0.1)' }}>
              <ShoppingBag className="w-12 h-12" style={{ color: '#c05300' }} />
            </div>
            <h3 className="text-2xl font-bold mb-2" style={{ color: '#c05300' }}>No Laddus Found</h3>
            <p className="max-w-md mx-auto" style={{ color: 'rgba(192, 83, 0, 0.7)' }}>
              We couldn&apos;t find any Laddus in this category. Try selecting a different category.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {displayProducts.map((product) => {
                const productId = product._id;
                const discountedPrice = product.discount
                  ? (product.price * (100 - product.discount)) / 100
                  : product.price;
                const hasSecondImage = product.images && product.images.length > 1;
                const inCart = isInCart(productId);
                const isUpdating = updatingItems[productId];
                const showControls = showQuantityControls[productId];
                
                const priorityBadge = product.priorityNumber !== undefined && product.priorityNumber > 0 ? (
                  <div className="absolute top-3 right-3 z-10">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold text-white ${
                      product.priorityNumber === 3 ? 'bg-gradient-to-r from-purple-600 to-indigo-600' :
                      product.priorityNumber === 2 ? 'bg-gradient-to-r from-blue-600 to-cyan-600' :
                      'bg-gradient-to-r from-green-600 to-emerald-600'
                    }`}>
                      {product.priorityNumber === 3 ? 'Best Seller' : 
                       product.priorityNumber === 2 ? 'Popular' : 
                       'New'}
                    </span>
                  </div>
                ) : null;

                const discountBadge = product.discount > 0 ? (
                  <div className="absolute top-3 left-3 z-10">
                    <span className="px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r from-red-500 to-orange-500">
                      {product.discount}% OFF
                    </span>
                  </div>
                ) : null;

                return (
                  <div
                    key={productId}
                    className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
                    style={{ border: '2px solid rgba(192, 83, 0, 0.1)' }}
                  >
                    <Link href={`/products/${product.slug.replace(/\s+/g, '-').toLowerCase()}`}>
                      <div className="relative h-72 overflow-hidden" style={{ background: 'linear-gradient(to bottom right, rgba(192, 83, 0, 0.05), rgba(192, 83, 0, 0.1))' }}>
                        {discountBadge}
                        {priorityBadge}
                        {product.images?.length > 0 ? (
                          <>
                            <Image
                              src={product.images[0]}
                              alt={product.name}
                              fill
                              className="object-cover transition-all duration-700 group-hover:scale-110"
                              style={{ objectFit: 'cover' }}
                            />
                            {hasSecondImage && (
                              <Image
                                src={product.images[1]}
                                alt={product.name}
                                fill
                                className="object-cover absolute top-0 left-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100"
                                style={{ objectFit: 'cover' }}
                              />
                            )}
                          </>
                        ) : (
                          <div className="w-full h-full flex items-center justify-center" style={{ background: 'linear-gradient(to bottom right, rgba(192, 83, 0, 0.05), rgba(192, 83, 0, 0.1))' }}>
                            <div className="text-center">
                              <ShoppingBag className="w-12 h-12 mx-auto" style={{ color: 'rgba(192, 83, 0, 0.3)' }} />
                              <p className="mt-2" style={{ color: 'rgba(192, 83, 0, 0.3)' }}>No Image</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </Link>
                    <div className="p-6" style={{ background: 'linear-gradient(to bottom, white, rgba(192, 83, 0, 0.05))' }}>
                      <Link href={`/products/${product.slug.replace(/\s+/g, '-').toLowerCase()}`}>
                        <h2 className="text-lg font-bold group-hover:opacity-90 transition-colors line-clamp-2 mb-2" style={{ color: '#c05300' }}>
                          {product.name}
                        </h2>
                      </Link>
                      <p className="text-sm mb-4 line-clamp-2" style={{ color: 'rgba(192, 83, 0, 0.7)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {product.shortdescription}  
                      </p>
                      
                      <div className="flex items-baseline gap-2 mb-5">
                        <span className="text-2xl font-bold" style={{ color: '#c05300' }}>
                          ₹{discountedPrice.toLocaleString()}
                        </span>
                        {product.discount > 0 && (
                          <span className="text-sm line-through" style={{ color: 'rgba(192, 83, 0, 0.4)' }}>
                            ₹{product.price.toLocaleString()}
                          </span>
                        )}
                        <span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: 'rgba(192, 83, 0, 0.1)', color: '#c05300' }}>
                          {product.weight}
                        </span>
                      </div>

                      {showControls ? (
                        <div className="flex items-center gap-3">
                          <div className="flex items-center rounded-full overflow-hidden flex-1" style={{ border: '2px solid rgba(192, 83, 0, 0.2)' }}>
                            <button
                              onClick={() => handleQuantityChange(productId, -1)}
                              disabled={isUpdating}
                              className="px-4 py-3 transition disabled:opacity-50 flex-1"
                              style={{ backgroundColor: 'rgba(192, 83, 0, 0.05)' }}
                            >
                              <Minus className="w-5 h-5 mx-auto" style={{ color: '#c05300' }} />
                            </button>
                            <span className="px-4 py-3 font-bold text-lg min-w-[3rem] text-center relative" style={{ color: '#c05300', backgroundColor: 'rgba(192, 83, 0, 0.05)' }}>
                              {quantities[productId] || 1}
                              {isUpdating && (
                                <span className="absolute inset-0 flex items-center justify-center" style={{ backgroundColor: 'rgba(192, 83, 0, 0.05)' }}>
                                  <div className="w-5 h-5 border-2 rounded-full animate-spin" style={{ borderColor: '#c05300', borderTopColor: 'transparent' }}></div>
                                </span>
                              )}
                            </span>
                            <button
                              onClick={() => handleQuantityChange(productId, 1)}
                              disabled={isUpdating}
                              className="px-4 py-3 transition disabled:opacity-50 flex-1"
                              style={{ backgroundColor: 'rgba(192, 83, 0, 0.05)' }}
                            >
                              <Plus className="w-5 h-5 mx-auto" style={{ color: '#c05300' }} />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          {!isAuthenticated ? (
                            <Link href="/login">
                              <button
                                className="w-full py-3 text-white rounded-full font-bold flex items-center justify-center gap-2 shadow-lg transition-all hover:shadow-xl"
                                style={{ backgroundColor: '#c05300' }}
                              >
                                Login to Add
                              </button>
                            </Link>
                          ) : (
                            <button
                              onClick={() => handleAddToCart(product)}
                              disabled={cartLoading || isUpdating || product.stock === 0}
                              className={`w-full py-3 rounded-full font-bold flex items-center justify-center gap-2 shadow-lg transition-all ${
                                product.stock === 0
                                  ? "cursor-not-allowed"
                                  : "hover:shadow-xl"
                              }`}
                              style={product.stock === 0
                                ? { 
                                    backgroundColor: 'rgba(192, 83, 0, 0.1)', 
                                    color: 'rgba(192, 83, 0, 0.5)'
                                  }
                                : { 
                                    backgroundColor: '#c05300', 
                                    color: 'white'
                                  }
                              }
                            >
                              {isUpdating ? (
                                <>
                                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                  Adding...
                                </>
                              ) : product.stock === 0 ? (
                                "Out of Stock"
                              ) : (
                                <>
                                  <ShoppingCart className="w-5 h-5" />
                                  ADD TO CART
                                </>
                              )}
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* More/Less Button */}
            {filteredProducts.length > 8 && (
              <div className="text-center mt-12">
                <button
                  onClick={() => setShowAllProducts(!showAllProducts)}
                  className="px-8 py-4 text-white font-bold rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 mx-auto"
                  style={{ backgroundColor: '#c05300' }}
                >
                  {showAllProducts ? (
                    <>
                      Show Less Products
                      <Minus className="w-5 h-5" />
                    </>
                  ) : (
                    <>
                      More Products
                      <Plus className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;