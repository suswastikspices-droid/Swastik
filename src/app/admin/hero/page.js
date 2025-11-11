'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

// Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL  
const IMAGE_UPLOAD_ENDPOINT = `${API_BASE_URL}/hero/upload`;
const HERO_IMAGES_ENDPOINT = `${API_BASE_URL}/hero`;

// Create axios instance with authorization interceptor
const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add request interceptor to include authorization token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Custom hook for API operations
const useHeroImages = () => {
  const [heroImages, setHeroImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchHeroImages = async () => {
    try {
      setLoading(true);
      const response = await api.get('/hero');
      setHeroImages(response.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch hero images');
      console.error('Error fetching hero images:', err);
      toast.error('Failed to fetch hero images');
    } finally {
      setLoading(false);
    }
  };

  const deleteHeroImage = async (id) => {
    try {
      await api.delete(`/hero/${id}`);
      setHeroImages(prev => prev.filter(img => img._id !== id));
      toast.success('Hero image deleted successfully');
      return true;
    } catch (err) {
      setError('Failed to delete hero image');
      console.error('Error deleting hero image:', err);
      toast.error('Failed to delete hero image');
      return false;
    }
  };

  const reorderHeroImages = async (updates) => {
    try {
      await api.put('/hero/reorder', { updates });
      toast.success('Hero images reordered successfully');
      return true;
    } catch (err) {
      setError('Failed to reorder hero images');
      console.error('Error reordering hero images:', err);
      toast.error('Failed to reorder hero images');
      return false;
    }
  };

  useEffect(() => {
    fetchHeroImages();
  }, []);

  return {
    heroImages,
    setHeroImages,
    loading,
    error,
    setError,
    fetchHeroImages,
    deleteHeroImage,
    reorderHeroImages
  };
};

// Form Component
const HeroImageForm = ({ 
  editingImage, 
  formData, 
  setFormData, 
  handleSubmit, 
  handleFileChange, 
  handleInputChange, 
  resetForm,
  loading 
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">
        {editingImage ? 'Edit Hero Image' : 'Add New Hero Image'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Desktop Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Desktop Image <span className="text-red-500">*</span>
            </label>
            <input
              type="file"
              name="desktopImage"
              onChange={handleFileChange}
              required={!editingImage}
              accept="image/*"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            {editingImage && !formData.desktopImage && (
              <div className="mt-2">
                <p className="text-xs text-gray-500">Current:</p>
                <img 
                  src={editingImage.desktopImageUrl} 
                  alt="Current desktop" 
                  className="w-32 h-20 object-cover rounded border"
                />
              </div>
            )}
            {formData.desktopImage && (
              <div className="mt-2">
                <p className="text-xs text-gray-500">Preview:</p>
                <img 
                  src={URL.createObjectURL(formData.desktopImage)} 
                  alt="Desktop preview" 
                  className="w-32 h-20 object-cover rounded border"
                />
              </div>
            )}
          </div>
          
          {/* Mobile Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mobile Image <span className="text-red-500">*</span>
            </label>
            <input
              type="file"
              name="mobileImage"
              onChange={handleFileChange}
              required={!editingImage}
              accept="image/*"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            {editingImage && !formData.mobileImage && editingImage.mobileImageUrl && (
              <div className="mt-2">
                <p className="text-xs text-gray-500">Current:</p>
                <img 
                  src={editingImage.mobileImageUrl} 
                  alt="Current mobile" 
                  className="w-32 h-20 object-cover rounded border"
                />
              </div>
            )}
            {formData.mobileImage && (
              <div className="mt-2">
                <p className="text-xs text-gray-500">Preview:</p>
                <img 
                  src={URL.createObjectURL(formData.mobileImage)} 
                  alt="Mobile preview" 
                  className="w-32 h-20 object-cover rounded border"
                />
              </div>
            )}
          </div>
        </div>
        
        {/* Link */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Link <span className="text-red-500">*</span>
          </label>
          <input
            type="url"
            name="link"
            value={formData.link}
            onChange={handleInputChange}
            required
            placeholder="https://example.com"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        {/* Sequence */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Sequence
          </label>
          <input
            type="number"
            name="sequence"
            value={formData.sequence}
            onChange={handleInputChange}
            min="0"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        {/* Buttons */}
        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 transition-colors"
          >
            {loading ? 'Saving...' : (editingImage ? 'Update' : 'Upload')}
          </button>
          
          {editingImage && (
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

// Image Card Component
const HeroImageCard = ({ 
  image, 
  index, 
  totalImages, 
  onEdit, 
  onDelete, 
  onMove 
}) => {
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      {/* Image Preview */}
      <div className="p-4 bg-gray-50 border-b">
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="flex-1">
            <h3 className="text-sm font-medium text-gray-700 mb-1">Desktop</h3>
            <img 
              src={image.desktopImageUrl} 
              alt="Desktop preview" 
              className="w-full h-32 object-cover rounded border"
            />
          </div>
          {image.mobileImageUrl && (
            <div className="flex-1">
              <h3 className="text-sm font-medium text-gray-700 mb-1">Mobile</h3>
              <img 
                src={image.mobileImageUrl} 
                alt="Mobile preview" 
                className="w-full h-32 object-cover rounded border"
              />
            </div>
          )}
        </div>
      </div>
      
      {/* Image Info */}
      <div className="p-4">
        <div className="mb-3">
          <p className="text-sm text-gray-500">Link:</p>
          <a 
            href={image.link} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 text-sm break-all"
          >
            {image.link}
          </a>
        </div>
        
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-500">Sequence:</p>
            <p className="font-medium">{image.sequence}</p>
          </div>
          
          {/* Action Buttons */}
          <div className="flex space-x-2">
            <button
              onClick={() => onEdit(image)}
              className="p-2 text-blue-600 hover:text-blue-800"
              aria-label="Edit"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
            </button>
            
            <button
              onClick={() => onDelete(image._id)}
              className="p-2 text-red-600 hover:text-red-800"
              aria-label="Delete"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </button>
            
            <button
              onClick={() => onMove(index, 'up')}
              disabled={index === 0}
              className={`p-2 ${index === 0 ? 'text-gray-300' : 'text-gray-600 hover:text-gray-800'}`}
              aria-label="Move Up"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
            </button>
            
            <button
              onClick={() => onMove(index, 'down')}
              disabled={index === totalImages - 1}
              className={`p-2 ${index === totalImages - 1 ? 'text-gray-300' : 'text-gray-600 hover:text-gray-800'}`}
              aria-label="Move Down"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Component
const HeroImageManager = () => {
  const [editingImage, setEditingImage] = useState(null);
  const [formData, setFormData] = useState({
    desktopImage: null,
    mobileImage: null,
    link: '',
    sequence: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const {
    heroImages,
    setHeroImages,
    loading: apiLoading,
    error: apiError,
    setError: setApiError,
    fetchHeroImages,
    deleteHeroImage,
    reorderHeroImages
  } = useHeroImages();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setFormData(prev => ({
        ...prev,
        [name]: files[0]
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const data = new FormData();
    data.append('link', formData.link);
    data.append('sequence', formData.sequence);
    
    if (formData.desktopImage) {
      data.append('desktopImage', formData.desktopImage);
    }
    
    if (formData.mobileImage) {
      data.append('mobileImage', formData.mobileImage);
    }

    try {
      if (editingImage) {
        await api.put(`/hero/${editingImage._id}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Hero image updated successfully');
      } else {
        await api.post('/hero/upload', data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Hero image uploaded successfully');
      }
      
      resetForm();
      fetchHeroImages();
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Operation failed';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('Error submitting form:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (image) => {
    setEditingImage(image);
    setFormData({
      desktopImage: null,
      mobileImage: null,
      link: image.link,
      sequence: image.sequence
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this hero image?')) return;
    
    const success = await deleteHeroImage(id);
    if (success) {
      // If we're deleting the image being edited, reset the form
      if (editingImage && editingImage._id === id) {
        resetForm();
      }
    }
  };

  const handleReorder = async () => {
    const updates = heroImages.map((img, index) => ({
      id: img._id,
      sequence: index
    }));
    
    const success = await reorderHeroImages(updates);
    if (success) {
      // Success toast is already shown in reorderHeroImages
    }
  };

  const moveImage = (index, direction) => {
    const newImages = [...heroImages];
    if (direction === 'up' && index > 0) {
      [newImages[index - 1], newImages[index]] = [newImages[index], newImages[index - 1]];
    } else if (direction === 'down' && index < newImages.length - 1) {
      [newImages[index], newImages[index + 1]] = [newImages[index + 1], newImages[index]];
    }
    setHeroImages(newImages);
  };

  const resetForm = () => {
    setEditingImage(null);
    setFormData({
      desktopImage: null,
      mobileImage: null,
      link: '',
      sequence: 0
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Hero Images Management</h1>
        
        {/* Form Section */}
        <HeroImageForm 
          editingImage={editingImage}
          formData={formData}
          setFormData={setFormData}
          handleSubmit={handleSubmit}
          handleFileChange={handleFileChange}
          handleInputChange={handleInputChange}
          resetForm={resetForm}
          loading={loading}
        />
        
        {/* Hero Images List */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <h2 className="text-xl font-semibold text-gray-700">Current Hero Images</h2>
            <button
              onClick={handleReorder}
              disabled={heroImages.length === 0}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 transition-colors"
            >
              Save Order
            </button>
          </div>
          
          {apiLoading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              <p className="mt-2 text-gray-600">Loading hero images...</p>
            </div>
          ) : heroImages.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No hero images found. Add your first hero image!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {heroImages.map((image, index) => (
                <HeroImageCard 
                  key={image._id}
                  image={image}
                  index={index}
                  totalImages={heroImages.length}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onMove={moveImage}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HeroImageManager;