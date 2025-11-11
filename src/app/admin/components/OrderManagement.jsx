import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Base URL for API
const BASE_URL = 'http://localhost:5000/api';

// Order Management Component
const OrderManagement = () => {
  // State declarations
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newOrder, setNewOrder] = useState({
    userId: '',
    addressId: '',
    items: [],
    totalPrice: 0,
    discount: 0,
    grandTotal: 0,
    paymentStatus: 'pending',
    orderStatus: 'processing'
  });
  const [editOrder, setEditOrder] = useState({});
  const [userRole, setUserRole] = useState('user'); // Default role
  const [userId, setUserId] = useState(''); // Current user ID

  // Fetch orders on component mount
  useEffect(() => {
    fetchOrders();
    // In a real app, you would get user info from context/auth
    // For demo purposes, we'll set default values
    setUserRole('admin'); // Change to test different roles
    setUserId('user123'); // Sample user ID
  }, []);

  // Fetch all orders or user orders based on role
  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    
    try {
      let url;
      if (userRole === 'admin' || userRole === 'seller' || userRole === 'manager') {
        url = `${BASE_URL}/orders`;
      } else {
        url = `${BASE_URL}/orders/user/${userId}`;
      }
      
      const response = await axios.get(url);
      setOrders(response.data.orders);
    } catch (err) {
      setError('Failed to fetch orders. Please try again.');
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  // Create a new order
  const handleCreateOrder = async () => {
    try {
      const response = await axios.post(`${BASE_URL}/orders/place-order`, {
        userId: newOrder.userId,
        addressId: newOrder.addressId
      });
      
      setOrders([response.data.order, ...orders]);
      setIsCreating(false);
      resetNewOrderForm();
      fetchOrders(); // Refresh the list
    } catch (err) {
      setError('Failed to create order. Please try again.');
      console.error('Error creating order:', err);
    }
  };

  // Update an existing order
  const handleUpdateOrder = async () => {
    try {
      const response = await axios.put(`${BASE_URL}/orders/${editOrder._id}`, editOrder);
      
      setOrders(orders.map(order => 
        order._id === editOrder._id ? response.data.order : order
      ));
      
      setIsEditing(false);
      setSelectedOrder(null);
    } catch (err) {
      setError('Failed to update order. Please try again.');
      console.error('Error updating order:', err);
    }
  };

  // Delete an order
  const handleDeleteOrder = async (orderId) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      try {
        await axios.delete(`${BASE_URL}/orders/${orderId}`);
        setOrders(orders.filter(order => order._id !== orderId));
      } catch (err) {
        setError('Failed to delete order. Please try again.');
        console.error('Error deleting order:', err);
      }
    }
  };

  // Get order details
  const handleViewOrder = async (orderId) => {
    try {
      const response = await axios.get(`${BASE_URL}/orders/${orderId}`);
      setSelectedOrder(response.data.order);
    } catch (err) {
      setError('Failed to fetch order details. Please try again.');
      console.error('Error fetching order details:', err);
    }
  };

  // Generate invoice
  const handleGenerateInvoice = async (orderId) => {
    try {
      const response = await axios.get(`${BASE_URL}/orders/invoice/${orderId}`, {
        responseType: 'blob'
      });
      
      // Create a blob URL to open the PDF
      const pdfBlob = new Blob([response.data], { type: 'application/pdf' });
      const pdfUrl = URL.createObjectURL(pdfBlob);
      window.open(pdfUrl);
    } catch (err) {
      setError('Failed to generate invoice. Please try again.');
      console.error('Error generating invoice:', err);
    }
  };

  // Reset new order form
  const resetNewOrderForm = () => {
    setNewOrder({
      userId: '',
      addressId: '',
      items: [],
      totalPrice: 0,
      discount: 0,
      grandTotal: 0,
      paymentStatus: 'pending',
      orderStatus: 'processing'
    });
  };

  // Handle input changes for new order
  const handleNewOrderChange = (e) => {
    const { name, value } = e.target;
    setNewOrder(prev => ({ ...prev, [name]: value }));
  };

  // Handle input changes for edit order
  const handleEditOrderChange = (e) => {
    const { name, value } = e.target;
    setEditOrder(prev => ({ ...prev, [name]: value }));
  };

  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  // Render loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl font-semibold">Loading orders...</div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl font-semibold text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Order Management</h1>
      
      {/* Create Order Button */}
      {(userRole === 'admin' || userRole === 'seller' || userRole === 'manager') && (
        <button
          onClick={() => setIsCreating(true)}
          className="mb-6 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Create New Order
        </button>
      )}

      {/* Orders Table */}
      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.length > 0 ? (
              orders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order._id.substring(0, 8)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.user?.name || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(order.createdAt)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${order.grandTotal.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${order.orderStatus === 'delivered' ? 'bg-green-100 text-green-800' : 
                        order.orderStatus === 'shipped' ? 'bg-blue-100 text-blue-800' : 
                        order.orderStatus === 'cancelled' ? 'bg-red-100 text-red-800' : 
                        'bg-yellow-100 text-yellow-800'}`}>
                      {order.orderStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleViewOrder(order._id)}
                      className="text-indigo-600 hover:text-indigo-900 mr-3"
                    >
                      View
                    </button>
                    {(userRole === 'admin' || userRole === 'seller' || userRole === 'manager') && (
                      <>
                        <button
                          onClick={() => {
                            setEditOrder(order);
                            setIsEditing(true);
                          }}
                          className="text-yellow-600 hover:text-yellow-900 mr-3"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteOrder(order._id)}
                          className="text-red-600 hover:text-red-900 mr-3"
                        >
                          Delete
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => handleGenerateInvoice(order._id)}
                      className="text-purple-600 hover:text-purple-900"
                    >
                      Invoice
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                  No orders found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Create Order Modal */}
      {isCreating && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">Create New Order</h2>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="userId">
                  User ID
                </label>
                <input
                  type="text"
                  id="userId"
                  name="userId"
                  value={newOrder.userId}
                  onChange={handleNewOrderChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="addressId">
                  Address ID
                </label>
                <input
                  type="text"
                  id="addressId"
                  name="addressId"
                  value={newOrder.addressId}
                  onChange={handleNewOrderChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setIsCreating(false)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateOrder}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  Create Order
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Order Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">Edit Order</h2>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="orderStatus">
                  Order Status
                </label>
                <select
                  id="orderStatus"
                  name="orderStatus"
                  value={editOrder.orderStatus}
                  onChange={handleEditOrderChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                >
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="paymentStatus">
                  Payment Status
                </label>
                <select
                  id="paymentStatus"
                  name="paymentStatus"
                  value={editOrder.paymentStatus}
                  onChange={handleEditOrderChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                >
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="failed">Failed</option>
                </select>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setIsEditing(false)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateOrder}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  Update Order
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-screen overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold">Order Details</h2>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Order Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Order ID</p>
                    <p className="font-medium">{selectedOrder._id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Date</p>
                    <p className="font-medium">{formatDate(selectedOrder.createdAt)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Order Status</p>
                    <p className="font-medium">{selectedOrder.orderStatus}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Payment Status</p>
                    <p className="font-medium">{selectedOrder.paymentStatus}</p>
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Items</h3>
                <div className="border rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {selectedOrder.items.map((item, index) => (
                        <tr key={index}>
                          <td className="px-4 py-2 whitespace-nowrap">
                            <div className="flex items-center">
                              {item.image && (
                                <img className="h-10 w-10 rounded object-cover mr-3" src={item.image} alt={item.name} />
                              )}
                              <div>
                                <div className="text-sm font-medium text-gray-900">{item.name}</div>
                                {item.variant && Object.keys(item.variant).length > 0 && (
                                  <div className="text-xs text-gray-500">
                                    {Object.entries(item.variant).map(([key, value]) => (
                                      <span key={key}>{key}: {value} </span>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                            ${item.discountPrice || item.price}
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                            {item.quantity}
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                            ${item.subtotal.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Pricing</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-medium">${selectedOrder.totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Discount:</span>
                    <span className="font-medium">-${selectedOrder.discount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg pt-2 border-t">
                    <span>Total:</span>
                    <span>${selectedOrder.grandTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => handleGenerateInvoice(selectedOrder._id)}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
                >
                  Generate Invoice
                </button>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderManagement;