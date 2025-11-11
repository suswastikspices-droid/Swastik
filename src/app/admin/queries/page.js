"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Mail,
  User,
  MessageSquare,
  Clock,
  CheckCircle,
  AlertCircle,
  Phone,
  Send,
  Search,
  Filter,
  FileText,
  Home,
  Settings,
  LogOut,
  X,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

const API_BASE = `${process.env.NEXT_PUBLIC_API_BASE_URL}/contact`;

export default function ContactSystem() {
  const router = useRouter();
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentQuery, setCurrentQuery] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'descending' });

  // Check authentication on component mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    fetchQueries();
  }, [router]);

  // Get auth token for API requests
  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}` 
    } : { 'Content-Type': 'application/json' };
  };

  // Fetch all queries (admin view)
  const fetchQueries = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_BASE, {
        headers: getAuthHeaders()
      });
      
      if (response.status === 401) {
        // Token expired or invalid
        localStorage.removeItem('token');
        router.push('/login');
        return;
      }
      
      const data = await response.json();
      
      // Ensure data is an array
      setQueries(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching queries:", error);
      showMessage("error", "Failed to fetch queries");
      setQueries([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: "", text: "" }), 5000);
  };

  // Handle admin reply
  const handleReply = async () => {
    if (!replyText) {
      showMessage("error", "Reply message is required");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/reply/${currentQuery._id}`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ reply: replyText }),
      });

      if (response.status === 401) {
        // Token expired or invalid
        localStorage.removeItem('token');
        router.push('/login');
        return;
      }

      const data = await response.json();

      if (response.ok) {
        showMessage("success", "Reply sent successfully!");
        setIsModalOpen(false);
        setReplyText("");
        fetchQueries();
      } else {
        showMessage("error", data.message || "Failed to send reply");
      }
    } catch (error) {
      showMessage("error", "Failed to send reply. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const openReplyModal = (query) => {
    setCurrentQuery(query);
    setReplyText("");
    setIsModalOpen(true);
  };

  const closeReplyModal = () => {
    setIsModalOpen(false);
    setCurrentQuery(null);
  };

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return <ChevronDown className="w-4 h-4 opacity-50" />;
    return sortConfig.direction === 'ascending' 
      ? <ChevronUp className="w-4 h-4" /> 
      : <ChevronDown className="w-4 h-4" />;
  };

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  // Filter and sort queries with safety checks
  const filteredQueries = Array.isArray(queries) ? queries
    .filter(query => {
      // Check if query exists and has required properties
      if (!query || !query.name || !query.email || !query.message) return false;
      
      const matchesSearch = 
        query.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        query.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        query.message.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesFilter = 
        filterStatus === "all" ||
        (filterStatus === "replied" && query.reply) ||
        (filterStatus === "pending" && !query.reply);
      
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      if (!a || !b) return 0;
      
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    }) : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header with logout button */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Contact Management System</h1>
            <p className="text-gray-600">Manage and respond to customer inquiries</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-100 hover:bg-red-200 text-red-700 py-2 px-4 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>

        {/* Message Alert */}
        {message.text && (
          <div
            className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
              message.type === "success"
                ? "bg-green-100 text-green-800 border border-green-200"
                : "bg-red-100 text-red-800 border border-red-200"
            }`}
          >
            {message.type === "success" ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            <span>{message.text}</span>
          </div>
        )}

        {/* Controls */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search queries..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex gap-3">
              <div className="relative">
                <select
                  className="appearance-none pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none bg-white"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="replied">Replied</option>
                  <option value="pending">Pending</option>
                </select>
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              </div>
              
              <button
                onClick={fetchQueries}
                className="bg-orange-100 hover:bg-orange-200 text-orange-700 font-medium py-2 px-4 rounded-lg transition-colors flex items-center gap-2"
              >
                Refresh
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
              <div className="flex items-center">
                <div className="bg-blue-100 p-3 rounded-lg mr-4">
                  <MessageSquare className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-blue-600">Total Queries</p>
                  <p className="text-2xl font-bold text-blue-800">{queries.length}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-green-50 rounded-lg p-4 border border-green-100">
              <div className="flex items-center">
                <div className="bg-green-100 p-3 rounded-lg mr-4">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-green-600">Replied</p>
                  <p className="text-2xl font-bold text-green-800">
                    {queries.filter(q => q && q.reply).length}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-orange-50 rounded-lg p-4 border border-orange-100">
              <div className="flex items-center">
                <div className="bg-orange-100 p-3 rounded-lg mr-4">
                  <Clock className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-orange-600">Pending</p>
                  <p className="text-2xl font-bold text-orange-800">
                    {queries.filter(q => q && !q.reply).length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Queries Table */}
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center">
                      Customer {getSortIcon('name')}
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('createdAt')}
                  >
                    <div className="flex items-center">
                      Date {getSortIcon('createdAt')}
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Message
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading && filteredQueries.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                      <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                      </div>
                      <p className="mt-2">Loading queries...</p>
                    </td>
                  </tr>
                ) : filteredQueries.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                      No queries found
                    </td>
                  </tr>
                ) : (
                  filteredQueries.map((query) => (
                    <tr key={query._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-orange-100 rounded-full flex items-center justify-center">
                            <User className="h-5 w-5 text-orange-600" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{query.name}</div>
                            <div className="text-sm text-gray-500 flex items-center">
                              <Mail className="h-3 w-3 mr-1" /> {query.email}
                            </div>
                            {query.phone && (
                              <div className="text-sm text-gray-500 flex items-center">
                                <Phone className="h-3 w-3 mr-1" /> {query.phone}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{formatDate(query.createdAt)}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-xs truncate" title={query.message}>
                          {query.message}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {query.reply ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <CheckCircle className="w-3 h-3" />
                            Replied
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                            <Clock className="w-3 h-3" />
                            Pending
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => openReplyModal(query)}
                          className="text-orange-600 hover:text-orange-900 bg-orange-50 hover:bg-orange-100 px-3 py-1 rounded-lg transition-colors"
                        >
                          {query.reply ? "View Reply" : "Reply"}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Reply Modal */}
      {isModalOpen && currentQuery && (
        <div className="fixed inset-0 bg-black/50  flex items-center justify-center p-4 z-50">
          <div className="bg-white border-2 border-amber-600 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-800">
                {currentQuery.reply ? "View Reply" : "Send Reply"}
              </h3>
              <button
                onClick={closeReplyModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-500 mb-1">Customer</h4>
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10 bg-orange-100 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-orange-600" />
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">{currentQuery.name}</div>
                    <div className="text-sm text-gray-500 flex items-center">
                      <Mail className="h-3 w-3 mr-1" /> {currentQuery.email}
                    </div>
                    {currentQuery.phone && (
                      <div className="text-sm text-gray-500 flex items-center">
                        <Phone className="h-3 w-3 mr-1" /> {currentQuery.phone}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-500 mb-1">Original Message</h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-700 whitespace-pre-wrap">{currentQuery.message}</p>
                </div>
              </div>
              
              {currentQuery.reply && (
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Your Reply</h4>
                  <div className="bg-orange-50 rounded-lg p-4 border-l-4 border-orange-500">
                    <p className="text-gray-700 whitespace-pre-wrap">{currentQuery.reply}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      Replied on: {formatDate(currentQuery.repliedAt)}
                    </p>
                  </div>
                </div>
              )}
              
              {!currentQuery.reply && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Your Reply</h4>
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    rows={6}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition resize-none"
                    placeholder="Type your reply here..."
                  />
                </div>
              )}
            </div>
            
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={closeReplyModal}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              {!currentQuery.reply && (
                <button
                  onClick={handleReply}
                  disabled={loading}
                  className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-6 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />
                  Send Reply
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}