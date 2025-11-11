'use client';
import React, { useState, useEffect, useMemo } from 'react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import {
  TrendingUp, TrendingDown, Package, DollarSign, ShoppingCart,
  Users, AlertCircle, CheckCircle, Clock, XCircle, MapPin, Phone, Mail
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { useOrderStore } from '../../../store/useOrderStore';

const OrderManagement = () => {
  // 🟢 Zustand store hooks
  const { orders, loading, fetchAllOrders, updateOrder, deleteOrder } = useOrderStore();

  // 🧠 Local UI state
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editOrder, setEditOrder] = useState({});
  const [userRole] = useState('admin');

  // Filters
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSummary, setShowSummary] = useState(true);

  // 🟡 Load Orders from Backend
  useEffect(() => {
    fetchAllOrders();
  }, [fetchAllOrders]);

  // 🟢 Filter Orders dynamically
  useEffect(() => {
    if (!orders || !orders.length) return;
    let result = [...orders];

    if (statusFilter !== 'all')
      result = result.filter(order => order.orderStatus === statusFilter);

    if (paymentStatusFilter !== 'all')
      result = result.filter(order => order.paymentStatus === paymentStatusFilter);

    const now = new Date();
    if (dateFilter === 'today') {
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      result = result.filter(order => new Date(order.createdAt) >= today);
    } else if (dateFilter === 'week') {
      const weekAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
      result = result.filter(order => new Date(order.createdAt) >= weekAgo);
    } else if (dateFilter === 'month') {
      const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
      result = result.filter(order => new Date(order.createdAt) >= monthAgo);
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(order =>
        order._id.toLowerCase().includes(q) ||
        (order.user?.name && order.user.name.toLowerCase().includes(q)) ||
        (order.user?.email && order.user.email.toLowerCase().includes(q))
      );
    }

    setFilteredOrders(result);
  }, [orders, statusFilter, paymentStatusFilter, dateFilter, searchQuery]);

  // 📊 Summary Stats
  const summaryStats = useMemo(() => {
    if (!filteredOrders || !filteredOrders.length) return {
      totalRevenue: 0,
      totalOrders: 0,
      avgValue: 0,
      statusCounts: {},
      paymentCounts: {},
      uniqueCustomers: 0,
      revenueTrend: [],
      statusDistribution: [],
      totalDiscount: 0
    };
    
    const totalRevenue = filteredOrders.reduce((sum, o) => sum + (o.grandTotal || 0), 0);
    const totalDiscount = filteredOrders.reduce((sum, o) => sum + (o.discount || 0), 0);
    const totalOrders = filteredOrders.length;
    const avgValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    const statusCounts = filteredOrders.reduce((a, o) => {
      a[o.orderStatus] = (a[o.orderStatus] || 0) + 1;
      return a;
    }, {});
    const paymentCounts = filteredOrders.reduce((a, o) => {
      a[o.paymentStatus] = (a[o.paymentStatus] || 0) + 1;
      return a;
    }, {});

    const uniqueCustomers = new Set(filteredOrders.map(o => o.user?._id)).size;

    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return d.toISOString().split('T')[0];
    });

    const revenueTrend = last7Days.map(date => {
      const dayOrders = orders.filter(o => o.createdAt.split('T')[0] === date);
      const revenue = dayOrders.reduce((s, o) => s + (o.grandTotal || 0), 0);
      return {
        date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        revenue: Math.round(revenue),
        orders: dayOrders.length
      };
    });

    const statusDistribution = Object.entries(statusCounts).map(([s, c]) => ({
      name: s.charAt(0).toUpperCase() + s.slice(1),
      value: c
    }));

    return {
      totalRevenue,
      totalOrders,
      avgValue,
      statusCounts,
      paymentCounts,
      uniqueCustomers,
      revenueTrend,
      statusDistribution,
      totalDiscount
    };
  }, [filteredOrders, orders]);

  const resetFilters = () => {
    setStatusFilter('all');
    setPaymentStatusFilter('all');
    setDateFilter('all');
    setSearchQuery('');
    toast.success('Filters reset!');
  };

  // 🟣 Update Order
  const handleUpdateOrder = async () => {
    await updateOrder(editOrder._id, {
      orderStatus: editOrder.orderStatus,
      paymentStatus: editOrder.paymentStatus,
    });
    setIsEditing(false);
    setSelectedOrder(null);
  };

  // 🔴 Delete Order
  const handleDeleteOrder = async (id) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      await deleteOrder(id);
    }
  };

  const formatDate = (date) => new Date(date).toLocaleDateString();
  const formatDateTime = (date) => new Date(date).toLocaleString();
  
  const getStatusColor = (status) => ({
    delivered: 'bg-green-100 text-green-800',
    shipped: 'bg-blue-100 text-blue-800',
    cancelled: 'bg-red-100 text-red-800',
    processing: 'bg-yellow-100 text-yellow-800'
  }[status] || 'bg-gray-100 text-gray-800');

  const getPaymentColor = (status) => ({
    paid: 'bg-green-100 text-green-800',
    failed: 'bg-red-100 text-red-800',
    pending: 'bg-yellow-100 text-yellow-800'
  }[status] || 'bg-gray-100 text-gray-800');

  const getStatusIcon = (status) => {
    switch(status) {
      case 'delivered': return <CheckCircle className="w-4 h-4" />;
      case 'shipped': return <Package className="w-4 h-4" />;
      case 'cancelled': return <XCircle className="w-4 h-4" />;
      case 'processing': return <Clock className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl font-semibold text-gray-700">Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-gray-50 min-h-screen">
      <Toaster position="top-right" />

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Order Management</h1>
        <button
          onClick={() => setShowSummary(!showSummary)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          {showSummary ? 'Hide' : 'Show'} Analytics
        </button>
      </div>

      {/* 🔹 Summary Dashboard */}
      {showSummary && (
        <div className="mb-8 space-y-6">
          {/* Stat Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <StatCard title="Total Revenue" value={`₹${summaryStats.totalRevenue?.toLocaleString('en-IN')}`} icon={<DollarSign />} color="blue" />
            <StatCard title="Total Orders" value={summaryStats.totalOrders} icon={<ShoppingCart />} color="green" />
            <StatCard title="Avg Order Value" value={`₹${Math.round(summaryStats.avgValue)}`} icon={<Package />} color="purple" />
            <StatCard title="Unique Customers" value={summaryStats.uniqueCustomers} icon={<Users />} color="orange" />
            <StatCard title="Total Discount" value={`₹${summaryStats.totalDiscount?.toLocaleString('en-IN')}`} icon={<TrendingDown />} color="red" />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartCard title="Revenue Trend (7 Days)">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={summaryStats.revenueTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`₹${value}`, 'Revenue']} />
                  <Legend />
                  <Line type="monotone" dataKey="revenue" stroke="#3b82f6" name="Revenue (₹)" strokeWidth={2} />
                  <Line type="monotone" dataKey="orders" stroke="#10b981" name="Orders" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Order Status Distribution">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={summaryStats.statusDistribution} cx="50%" cy="50%" label outerRadius={100} dataKey="value">
                    {summaryStats.statusDistribution?.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} orders`, 'Count']} />
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>
        </div>
      )}

      {/* 🔸 Filters */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="flex flex-wrap gap-4 items-end">
          <input
            type="text"
            placeholder="Search by ID, Customer or Email"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border border-gray-300 px-3 py-2 rounded-md flex-1 min-w-[200px]"
          />
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="border px-3 py-2 rounded-md">
            <option value="all">All Statuses</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <select value={paymentStatusFilter} onChange={(e) => setPaymentStatusFilter(e.target.value)} className="border px-3 py-2 rounded-md">
            <option value="all">All Payments</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>
          <select value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} className="border px-3 py-2 rounded-md">
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">Last 7 Days</option>
            <option value="month">Last 30 Days</option>
          </select>
          <button onClick={resetFilters} className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300 transition-colors">Reset</button>
        </div>
      </div>

      {/* 🔹 Orders Grid */}
      {filteredOrders.length ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOrders.map(order => (
            <div key={order._id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden">
              <div className="p-5">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">#{order._id.slice(-8)}</h3>
                    <p className="text-sm text-gray-500">{formatDateTime(order.createdAt)}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full flex items-center gap-1 ${getStatusColor(order.orderStatus)}`}>
                    {getStatusIcon(order.orderStatus)}
                    {order.orderStatus}
                  </span>
                </div>
                
                <div className="space-y-2 mb-3 text-sm">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-gray-500" />
                    <span className="font-medium">{order.user?.name || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-600">{order.user?.email || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-gray-500" />
                    <span>{order.items?.length || 0} items</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-600 truncate">{order.address?.city}, {order.address?.state}</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center pt-3 border-t">
                  <div>
                    <p className="text-xs text-gray-500">Payment: 
                      <span className={`ml-1 px-2 py-0.5 rounded-full text-xs font-semibold ${getPaymentColor(order.paymentStatus)}`}>
                        {order.paymentStatus}
                      </span>
                    </p>
                    <p className="font-bold text-gray-800">₹{order.grandTotal?.toFixed(2)}</p>
                    {order.discount > 0 && (
                      <p className="text-xs text-green-600">Saved ₹{order.discount?.toFixed(2)}</p>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => setSelectedOrder(order)} 
                      className="text-blue-600 hover:text-blue-800 p-1 rounded-full hover:bg-blue-50"
                      title="View Details"
                    >
                      <Package className="w-5 h-5" />
                    </button>
                    {userRole === 'admin' && (
                      <>
                        <button 
                          onClick={() => { setEditOrder(order); setIsEditing(true); }} 
                          className="text-yellow-600 hover:text-yellow-800 p-1 rounded-full hover:bg-yellow-50"
                          title="Edit Order"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                          </svg>
                        </button>
                        <button 
                          onClick={() => handleDeleteOrder(order._id)} 
                          className="text-red-600 hover:text-red-800 p-1 rounded-full hover:bg-red-50"
                          title="Delete Order"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white text-center py-16 rounded-lg shadow">
          <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600">No orders found.</p>
        </div>
      )}

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-gray-800">Order Details</h2>
                <button 
                  onClick={() => setSelectedOrder(null)} 
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-lg mb-3 text-gray-700">Order Information</h3>
                  <div className="space-y-2">
                    <p><span className="font-medium">Order ID:</span> #{selectedOrder._id}</p>
                    <p><span className="font-medium">Date:</span> {formatDateTime(selectedOrder.createdAt)}</p>
                    <p><span className="font-medium">Status:</span> 
                      <span className={`ml-2 px-2 py-1 text-xs rounded-full ${getStatusColor(selectedOrder.orderStatus)}`}>
                        {selectedOrder.orderStatus}
                      </span>
                    </p>
                    <p><span className="font-medium">Payment:</span> 
                      <span className={`ml-2 px-2 py-1 text-xs rounded-full ${getPaymentColor(selectedOrder.paymentStatus)}`}>
                        {selectedOrder.paymentStatus}
                      </span>
                    </p>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-lg mb-3 text-gray-700">Customer Information</h3>
                  <div className="space-y-2">
                    <p><span className="font-medium">Name:</span> {selectedOrder.user?.name}</p>
                    <p><span className="font-medium">Email:</span> {selectedOrder.user?.email}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <h3 className="font-semibold text-lg mb-3 text-gray-700">Shipping Address</h3>
                <div className="space-y-1">
                  <p className="font-medium">{selectedOrder.address?.fullName}</p>
                  <p>{selectedOrder.address?.street}</p>
                  {selectedOrder.address?.addressLine2 && <p>{selectedOrder.address.addressLine2}</p>}
                  <p>{selectedOrder.address?.landmark}</p>
                  <p>{selectedOrder.address?.city}, {selectedOrder.address?.state} {selectedOrder.address?.postalCode}</p>
                  <p>{selectedOrder.address?.country}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span>{selectedOrder.address?.phone}</span>
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="font-semibold text-lg mb-3 text-gray-700">Order Items</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {selectedOrder.items?.map((item, index) => (
                        <tr key={index}>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="flex items-center">
                              {item.image && (
                                <div className="flex-shrink-0 h-10 w-10">
                                  <img className="h-10 w-10 rounded-md object-cover" src={item.image} alt={item.name} />
                                </div>
                              )}
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{item.name}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">₹{item.price?.toFixed(2)}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{item.quantity}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">₹{item.subtotal?.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-gray-50">
                      <tr>
                        <td colSpan="3" className="px-4 py-3 text-sm font-medium text-gray-900 text-right">Subtotal:</td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">₹{selectedOrder.totalPrice?.toFixed(2)}</td>
                      </tr>
                      {selectedOrder.discount > 0 && (
                        <tr>
                          <td colSpan="3" className="px-4 py-3 text-sm font-medium text-gray-900 text-right">Discount:</td>
                          <td className="px-4 py-3 text-sm font-medium text-green-600">-₹{selectedOrder.discount?.toFixed(2)}</td>
                        </tr>
                      )}
                      <tr>
                        <td colSpan="3" className="px-4 py-3 text-sm font-bold text-gray-900 text-right">Total:</td>
                        <td className="px-4 py-3 text-sm font-bold text-gray-900">₹{selectedOrder.grandTotal?.toFixed(2)}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button 
                  onClick={() => setSelectedOrder(null)} 
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Close
                </button>
                {userRole === 'admin' && (
                  <button 
                    onClick={() => { setEditOrder(selectedOrder); setIsEditing(true); setSelectedOrder(null); }} 
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Edit Order
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Order Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-gray-800">Edit Order</h2>
                <button 
                  onClick={() => setIsEditing(false)} 
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Order Status</label>
                  <select 
                    value={editOrder.orderStatus} 
                    onChange={(e) => setEditOrder({...editOrder, orderStatus: e.target.value})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  >
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Payment Status</label>
                  <select 
                    value={editOrder.paymentStatus} 
                    onChange={(e) => setEditOrder({...editOrder, paymentStatus: e.target.value})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  >
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="failed">Failed</option>
                  </select>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button 
                  onClick={() => setIsEditing(false)} 
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleUpdateOrder} 
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Reusable Stat Card
const StatCard = ({ title, value, icon, color }) => (
  <div className={`bg-white rounded-lg shadow-md p-6 border-l-4 border-${color}-500`}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-600">{title}</p>
        <h3 className="text-2xl font-bold">{value}</h3>
      </div>
      <div className={`bg-${color}-100 p-3 rounded-full text-${color}-600`}>
        {icon}
      </div>
    </div>
  </div>
);

const ChartCard = ({ title, children }) => (
  <div className="bg-white rounded-lg shadow-md p-6">
    <h3 className="text-lg font-semibold mb-4 text-gray-800">{title}</h3>
    {children}
  </div>
);

export default OrderManagement;