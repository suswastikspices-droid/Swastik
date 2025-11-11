"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import { Upload, X, Edit2, Trash2, Plus, Image, Save, PackageSearch, DollarSign, Tag, Info, Sparkles, GripVertical, Leaf } from 'lucide-react';
import { useProductStore } from '@/store/ProductStore';

// ----------------- Main Component -----------------
export default function ProductManager() {
  const { Slug: categoryId, slug: subCategoryId } = useParams();
  const { products, loading, fetchProducts, createProduct, updateProduct, deleteProduct } =
    useProductStore();

  const [form, setForm] = useState(getEmptyForm());
  const [editingId, setEditingId] = useState(null);
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (categoryId && subCategoryId) fetchProducts({ categoryId, subCategoryId });
  }, [categoryId, subCategoryId]);

  // ---------- Image handlers ----------
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + form.existingImages.length > 10) {
      toast.error("Maximum 10 images allowed.");
      return;
    }
    setForm({ ...form, images: [...form.images, ...files] });
    toast.success(`${files.length} image(s) added successfully`);
  };

  const handleRemoveImage = (index, isExisting = false) => {
    if (isExisting) {
      const removed = form.existingImages[index];
      setForm({
        ...form,
        existingImages: form.existingImages.filter((_, i) => i !== index),
        imagesToRemove: [...form.imagesToRemove, removed],
        imageSequence: form.imageSequence.filter((url) => url !== removed),
      });
    } else {
      setForm({ ...form, images: form.images.filter((_, i) => i !== index) });
    }
    toast.success("Image removed successfully");
  };

  const handleDragStart = (index) => setDraggedIndex(index);
  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
    const items = [...form.existingImages];
    const draggedItem = items[draggedIndex];
    items.splice(draggedIndex, 1);
    items.splice(index, 0, draggedItem);
    setForm({ ...form, existingImages: items, imageSequence: items });
    setDraggedIndex(index);
  };
  const handleDragEnd = () => setDraggedIndex(null);

  // ---------- Form handlers ----------
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.price || !form.description || !form.shortdescription) {
      toast.error("Please fill required fields");
      return;
    }
    const payload = {
      ...form,
      category: categoryId,
      subCategory: subCategoryId,
      imagesToRemove: form.imagesToRemove,
      imageSequence: form.imageSequence.length ? form.imageSequence : form.existingImages,
    };
    try {
      if (editingId) {
        await updateProduct(editingId, payload);
        setEditingId(null);
      } else {
        await createProduct(payload);
        toast.success("Product created successfully!");
      }
      resetForm();
      setShowForm(false);
    } catch (err) {
      toast.error("An error occurred. Please try again.");
      console.error(err);
    }
  };

  const resetForm = () => {
    setForm(getEmptyForm());
    setEditingId(null);
  };

  const handleEdit = (product) => {
    setEditingId(product._id);
    setForm({
      ...getEmptyForm(),
      ...product,
      images: [],
      existingImages: product.images || [],
      imagesToRemove: [],
      imageSequence: product.images || [],
      technicalDetails: product.technicalDetails || { packagingType: "", countryOfOrigin: "", itemForm: "" },
      nutritionalInfo: product.nutritionalInfo || { per: "100g", values: [] },
      faq: product.faq || [],
      ingredients: product.ingredients || [],
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
    toast.success("Product loaded for editing");
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      await deleteProduct(id);
      toast.success("Product deleted successfully!");
    }
  };

  const totalImages = form.existingImages.length + form.images.length;

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 sm:p-6 lg:p-8">
      <Toaster position="top-right" reverseOrder={false} />
      
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-slate-200">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-md">
                <PackageSearch className="text-white" size={28} />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Product Manager
                </h1>
                <p className="text-slate-600 text-sm mt-1">Manage your products with ease and efficiency</p>
              </div>
            </div>
            <button
              onClick={() => { setShowForm(!showForm); if (showForm) resetForm(); }}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:shadow-xl hover:scale-105 transition-all duration-300 font-medium"
            >
              {showForm ? <X size={20} /> : <Plus size={20} />}
              {showForm ? "Cancel" : "Add New Product"}
            </button>
          </div>
          
          {!showForm && (
            <div className="mt-4">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
            </div>
          )}
        </div>

        {/* Product Form */}
        {showForm && (
          <ProductForm
            form={form}
            setForm={setForm}
            handleSubmit={handleSubmit}
            editingId={editingId}
            loading={loading}
            handleImageChange={handleImageChange}
            handleRemoveImage={handleRemoveImage}
            handleDragStart={handleDragStart}
            handleDragOver={handleDragOver}
            handleDragEnd={handleDragEnd}
            totalImages={totalImages}
          />
        )}

        {/* Products Grid */}
        {!showForm && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-slate-700">
                All Products ({filteredProducts.length})
              </h2>
            </div>
            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-md p-12 text-center border border-slate-200">
                <PackageSearch className="mx-auto text-slate-400 mb-4" size={64} />
                <h3 className="text-xl font-semibold text-slate-700 mb-2">No products found</h3>
                <p className="text-slate-500 mb-6">Start by adding your first product</p>
                <button
                  onClick={() => setShowForm(true)}
                  className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 font-medium"
                >
                  Add Product
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product._id} product={product} handleEdit={handleEdit} handleDelete={handleDelete} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ----------------- Helpers -----------------
function getEmptyForm() {
  return {
    name: "",
    price: "",
    discount: 0,
    description: "",
    shortdescription: "",
    brand: "",
    manufacturer: "",
    ingredients: [],
    shelfLife: "",
    storageInstructions: "",
    isVegetarian: true,
    allergenInfo: "",
    nutritionalInfo: { per: "100g", values: [] },
    technicalDetails: { packagingType: "", countryOfOrigin: "", itemForm: "" },
    faq: [],
    availabilityStatus: "In Stock",
    availableQuantity: 0,
    images: [],
    existingImages: [],
    imagesToRemove: [],
    imageSequence: [],
    tags: [],
    weight: "", // Added missing field
    priorityNumber: 0, // Added missing field
  };
}

// ----------------- Product Form -----------------
function ProductForm({
  form,
  setForm,
  handleSubmit,
  editingId,
  loading,
  handleImageChange,
  handleRemoveImage,
  handleDragStart,
  handleDragOver,
  handleDragEnd,
  totalImages,
}) {
  const [activeTab, setActiveTab] = useState("basic");

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg mb-8 border border-slate-200 overflow-hidden">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          {editingId ? <Edit2 size={24} /> : <Sparkles size={24} />}
          {editingId ? "Edit Product" : "Create New Product"}
        </h2>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 px-6 bg-slate-50">
        {[
          { id: "basic", label: "Basic Info", icon: Info },
          { id: "details", label: "Details", icon: PackageSearch },
          { id: "images", label: "Images", icon: Image },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-3 font-medium transition-all ${
              activeTab === tab.id
                ? "border-b-2 border-indigo-600 text-indigo-600"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <tab.icon size={18} />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="p-6">
        {activeTab === "basic" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                label="Product Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                icon={<Tag size={18} />}
              />
              <InputField
                label="Price"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                required
                icon={<DollarSign size={18} />}
              />
              <InputField
                label="Discount in (%)"
                value={form.discount}
                type="number"
                onChange={(e) => setForm({ ...form, discount: e.target.value === '' ? 0 : Number(e.target.value) })}
                icon={<Tag size={18} />}
              />
              <InputField
                label="Brand"
                value={form.brand}
                onChange={(e) => setForm({ ...form, brand: e.target.value })}
              />
              <InputField
                label="Manufacturer"
                value={form.manufacturer}
                onChange={(e) => setForm({ ...form, manufacturer: e.target.value })}
              />
              <InputField
                label="Shelf Life"
                value={form.shelfLife}
                onChange={(e) => setForm({ ...form, shelfLife: e.target.value })}
                placeholder="e.g., 12 months"
              />
              {/* Added missing weight field */}
              <InputField
                label="Weight"
                required
                value={form.weight}
                onChange={(e) => setForm({ ...form, weight: e.target.value })}
                placeholder="e.g., 500g, 1kg"
              />
              {/* Added missing priorityNumber field */}
              <InputField
                label="Priority Number"
                value={form.priorityNumber}
                type="number"
                onChange={(e) => setForm({ ...form, priorityNumber: e.target.value })}
                placeholder="Display priority"
              />
            </div>

            {/* Vegetarian Toggle */}
            <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-xl">
              <Leaf className="text-green-600" size={24} />
              <div className="flex-1">
                <label className="font-semibold text-slate-700 block">Vegetarian Product</label>
                <p className="text-sm text-slate-500">Is this product suitable for vegetarians?</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setForm({ ...form, isVegetarian: !form.isVegetarian });
                  toast.success(`Product marked as ${!form.isVegetarian ? 'vegetarian' : 'non-vegetarian'}`);
                }}
                className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                  form.isVegetarian ? "bg-green-600" : "bg-slate-300"
                }`}
              >
                <span
                  className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                    form.isVegetarian ? "translate-x-7" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            <TextAreaField
              label="Short Description"
              value={form.shortdescription}
              onChange={(e) => setForm({ ...form, shortdescription: e.target.value })}
              required
              rows={2}
            />
            <TextAreaField
              label="Full Description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              required
              rows={4}
            />
            <TextAreaField
              label="Storage Instructions"
              value={form.storageInstructions}
              onChange={(e) => setForm({ ...form, storageInstructions: e.target.value })}
              rows={2}
              placeholder="e.g., Store in a cool, dry place"
            />
            <TextAreaField
              label="All Ingredients Info"
              value={form.allergenInfo}
              onChange={(e) => setForm({ ...form, allergenInfo: e.target.value })}
              rows={2}
              placeholder="e.g., Contains nuts, May contain traces of milk"
            />
            
            {/* Tags Section */}
            <TagsForm form={form} setForm={setForm} />
          </div>
        )}

        {activeTab === "details" && (
          <div className="space-y-6">
            <TechnicalDetailsForm form={form} setForm={setForm} />
            <NutritionalInfoForm form={form} setForm={setForm} />
            <FAQForm form={form} setForm={setForm} />
          </div>
        )}

        {activeTab === "images" && (
          <ImageUploadSection
            images={form.images}
            existingImages={form.existingImages}
            handleImageChange={handleImageChange}
            handleRemoveImage={handleRemoveImage}
            handleDragStart={handleDragStart}
            handleDragOver={handleDragOver}
            handleDragEnd={handleDragEnd}
            totalImages={totalImages}
          />
        )}

        <div className="flex gap-3 mt-8 pt-6 border-t border-slate-200">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:shadow-xl hover:scale-105 transition-all duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save size={20} />
            {loading ? "Saving..." : editingId ? "Update Product" : "Create Product"}
          </button>
        </div>
      </div>
    </form>
  );
}

// ----------------- Tags Form -----------------
function TagsForm({ form, setForm }) {
  const addTag = () => {
    if (form.tags.length < 4) {
      setForm({ ...form, tags: [...form.tags, ""] });
      toast.success("Tag added");
    } else {
      toast.error("Maximum 4 tags allowed");
    }
  };

  const updateTag = (index, value) => {
    const newTags = [...form.tags];
    newTags[index] = value;
    setForm({ ...form, tags: newTags });
  };

  const removeTag = (index) => {
    const newTags = form.tags.filter((_, i) => i !== index);
    setForm({ ...form, tags: newTags });
    toast.success("Tag removed");
  };

  return (
    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
      <div className="flex items-center justify-between mb-3">
        <label className="font-semibold text-slate-700 text-lg">Product Tags</label>
        <span className="text-sm text-slate-500">{form.tags.length}/4 tags</span>
      </div>
      
      <div className="space-y-3">
        {form.tags.map((tag, index) => (
          <div key={index} className="flex gap-2">
            <input
              type="text"
              value={tag}
              onChange={(e) => updateTag(index, e.target.value)}
              placeholder={`Tag ${index + 1}`}
              className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <button
              type="button"
              onClick={() => removeTag(index)}
              className="px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        ))}
      </div>
      
      <button
        type="button"
        onClick={addTag}
        disabled={form.tags.length >= 4}
        className={`mt-3 flex items-center gap-2 px-4 py-2 rounded-lg transition-colors font-medium ${
          form.tags.length >= 4
            ? "bg-slate-200 text-slate-400 cursor-not-allowed"
            : "bg-indigo-100 text-indigo-600 hover:bg-indigo-200"
        }`}
      >
        <Plus size={18} />
        Add Tag
      </button>
    </div>
  );
}

// ----------------- InputField -----------------
function InputField({ label, value, onChange, type = "text", required = false, icon, placeholder = "" }) {
  return (
    <div className="flex flex-col">
      <label className="mb-2 font-semibold text-slate-700 flex items-center gap-2">
        {icon}
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        className="px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
      />
    </div>
  );
}

// ----------------- TextAreaField -----------------
function TextAreaField({ label, value, onChange, required = false, rows = 3, placeholder = "" }) {
  return (
    <div className="flex flex-col">
      <label className="mb-2 font-semibold text-slate-700">
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      <textarea
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        className="px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
        rows={rows}
      />
    </div>
  );
}

// ----------------- NutritionalInfoForm -----------------
function NutritionalInfoForm({ form, setForm }) {
  const addRow = () => {
    setForm({
      ...form,
      nutritionalInfo: {
        ...form.nutritionalInfo,
        values: [...form.nutritionalInfo.values, { name: "", value: "" }],
      },
    });
    toast.success("Nutrient added");
  };
  const updateRow = (index, key, val) => {
    const values = [...form.nutritionalInfo.values];
    values[index][key] = val;
    setForm({ ...form, nutritionalInfo: { ...form.nutritionalInfo, values } });
  };
  const removeRow = (index) => {
    const values = form.nutritionalInfo.values.filter((_, i) => i !== index);
    setForm({ ...form, nutritionalInfo: { ...form.nutritionalInfo, values } });
    toast.success("Nutrient removed");
  };
  return (
    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
      <label className="font-semibold text-slate-700 mb-3 block text-lg">
        Nutritional Information (per {form.nutritionalInfo.per})
      </label>
      <div className="space-y-2">
        {form.nutritionalInfo.values.map((item, i) => (
          <div key={i} className="flex gap-2">
            <input
              type="text"
              placeholder="Nutrient name"
              value={item.name}
              onChange={(e) => updateRow(i, "name", e.target.value)}
              className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <input
              type="text"
              placeholder="Value"
              value={item.value}
              onChange={(e) => updateRow(i, "value", e.target.value)}
              className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <button
              type="button"
              onClick={() => removeRow(i)}
              className="px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={addRow}
        className="mt-3 flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-600 rounded-lg hover:bg-indigo-200 transition-colors font-medium"
      >
        <Plus size={18} />
        Add Nutrient
      </button>
    </div>
  );
}

// ----------------- TechnicalDetailsForm -----------------
function TechnicalDetailsForm({ form, setForm }) {
  return (
    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
      <label className="font-semibold text-slate-700 mb-3 block text-lg">Technical Details</label>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <InputField
          label="Packaging Type"
          value={form.technicalDetails.packagingType}
          onChange={(e) =>
            setForm({
              ...form,
              technicalDetails: { ...form.technicalDetails, packagingType: e.target.value },
            })
          }
        />
        <InputField
          label="Country of Origin"
          value={form.technicalDetails.countryOfOrigin}
          onChange={(e) =>
            setForm({
              ...form,
              technicalDetails: { ...form.technicalDetails, countryOfOrigin: e.target.value },
            })
          }
        />
        <InputField
          label="Item Form"
          value={form.technicalDetails.itemForm}
          onChange={(e) =>
            setForm({
              ...form,
              technicalDetails: { ...form.technicalDetails, itemForm: e.target.value },
            })
          }
        />
      </div>
    </div>
  );
}

// ----------------- FAQForm -----------------
function FAQForm({ form, setForm }) {
  const addRow = () => {
    setForm({ ...form, faq: [...form.faq, { question: "", answer: "" }] });
    toast.success("FAQ added");
  };
  const updateRow = (index, key, val) => {
    const faq = [...form.faq];
    faq[index][key] = val;
    setForm({ ...form, faq });
  };
  const removeRow = (index) => {
    const faq = form.faq.filter((_, i) => i !== index);
    setForm({ ...form, faq });
    toast.success("FAQ removed");
  };
  return (
    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
      <label className="font-semibold text-slate-700 mb-3 block text-lg">FAQs</label>
      <div className="space-y-3">
        {form.faq.map((item, i) => (
          <div key={i} className="bg-white p-3 rounded-lg border border-slate-200">
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="Question"
                value={item.question}
                onChange={(e) => updateRow(i, "question", e.target.value)}
                className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <button
                type="button"
                onClick={() => removeRow(i)}
                className="px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            <textarea
              placeholder="Answer"
              value={item.answer}
              onChange={(e) => updateRow(i, "answer", e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
              rows={2}
            />
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={addRow}
        className="mt-3 flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-600 rounded-lg hover:bg-indigo-200 transition-colors font-medium"
      >
        <Plus size={18} />
        Add FAQ
      </button>
    </div>
  );
}

// ----------------- Image Upload Section -----------------
function ImageUploadSection({
  images,
  existingImages,
  handleImageChange,
  handleRemoveImage,
  handleDragStart,
  handleDragOver,
  handleDragEnd,
  totalImages,
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="font-semibold text-slate-700 text-lg flex items-center gap-2">
          <Image size={20} />
          Product Images
          <span className="text-sm font-normal text-slate-500">({totalImages}/10)</span>
        </label>
      </div>

      <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 hover:border-indigo-400 transition-colors bg-slate-50">
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageChange}
          className="hidden"
          id="image-upload"
        />
        <label
          htmlFor="image-upload"
          className="flex flex-col items-center justify-center cursor-pointer"
        >
          <Upload className="text-slate-400 mb-2" size={40} />
          <p className="text-slate-600 font-medium mb-1">Click to upload images</p>
          <p className="text-slate-400 text-sm">PNG, JPG up to 10 images</p>
        </label>
      </div>

      {totalImages > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3 text-sm text-slate-600">
            <GripVertical size={16} />
            <span>Drag to reorder images</span>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
            {existingImages.map((img, i) => (
              <div
                key={i}
                draggable
                onDragStart={() => handleDragStart(i)}
                onDragOver={(e) => handleDragOver(e, i)}
                onDragEnd={handleDragEnd}
                className="relative group aspect-square border-2 border-slate-200 rounded-xl overflow-hidden cursor-move hover:border-indigo-400 transition-all bg-slate-100"
              >
                <img 
                  src={img} 
                  alt="" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentElement.classList.add('bg-slate-200');
                  }}
                />
                <div className="absolute inset-0   bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center">
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(i, true)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity bg-red-500 text-white rounded-full p-2 hover:bg-red-600"
                  >
                    <X size={18} />
                  </button>
                </div>
                {i === 0 && (
                  <div className="absolute top-2 left-2 bg-indigo-600 text-white text-xs px-2 py-1 rounded-md font-medium">
                    Primary
                  </div>
                )}
              </div>
            ))}
            {images.map((img, i) => (
              <div
                key={i}
                className="relative group aspect-square border-2 border-slate-200 rounded-xl overflow-hidden bg-slate-100"
              >
                <img 
                  src={URL.createObjectURL(img)} 
                  alt="" 
                  className="w-full h-full object-cover" 
                />
                <div className="absolute inset-0   bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center">
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(i, false)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity bg-red-500 text-white rounded-full p-2 hover:bg-red-600"
                  >
                    <X size={18} />
                  </button>
                </div>
                <div className="absolute top-2 left-2 bg-green-600 text-white text-xs px-2 py-1 rounded-md font-medium">
                  New
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ----------------- Product Card -----------------
function ProductCard({ product, handleEdit, handleDelete }) {
  // Parse discount as a number (it might be stored as a string)
  const discountPercentage = parseFloat(product.discount) || 0;
  
  // Calculate discounted price
  const originalPrice = parseFloat(product.price) || 0;
  const discountedPrice = discountPercentage > 0 
    ? (originalPrice * (1 - discountPercentage / 100)).toFixed(2)
    : originalPrice.toFixed(2);

  return (
    <div className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-200 flex flex-col">
      <div className="relative overflow-hidden aspect-square bg-slate-100">
        {product.images?.[0] ? (
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.parentElement.innerHTML = '<div class="w-full h-full flex items-center justify-center bg-slate-200"><svg class="text-slate-400" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg></div>';
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-slate-200">
            <Image className="text-slate-400" size={64} />
          </div>
        )}
        {discountPercentage > 0 && (
          <div className="absolute top-3 right-3 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full shadow-lg">
            {discountPercentage}% OFF
          </div>
        )}
        {product.isVegetarian && (
          <div className="absolute top-3 left-3 bg-green-500 text-white p-1.5 rounded-full shadow-lg">
            <Leaf size={16} />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-bold text-lg text-slate-800 mb-1 line-clamp-2">{product.name}</h3>
        <p className="text-slate-500 text-sm mb-3 line-clamp-2 flex-grow">{product.shortdescription}</p>
        
        <div className="flex items-baseline gap-2 mb-4">
          <span className="text-2xl font-bold text-indigo-600">
            ₹{discountedPrice}
          </span>
          {discountPercentage > 0 && (
            <span className="text-sm text-slate-400 line-through">₹{originalPrice.toFixed(2)}</span>
          )}
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => handleEdit(product)}
            className="flex-1 py-2.5 bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-lg hover:shadow-lg transition-all duration-300 flex justify-center items-center gap-2 font-medium group"
          >
            <Edit2 size={16} className="group-hover:rotate-12 transition-transform" />
            Edit
          </button>
          <button
            onClick={() => handleDelete(product._id)}
            className="flex-1 py-2.5 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-lg hover:shadow-lg transition-all duration-300 flex justify-center items-center gap-2 font-medium group"
          >
            <Trash2 size={16} className="group-hover:scale-110 transition-transform" />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}