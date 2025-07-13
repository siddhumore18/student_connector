import React, { useState, useEffect } from 'react';
import { 
  subscribeToMessRequests, 
  subscribeToHousingRequests, 
  approveMessRequest, 
  approveHousingRequest, 
  rejectRequest 
} from '../services/firebase';
import toast from 'react-hot-toast';
import { Users, Building, UtensilsCrossed, Settings, BarChart3, Plus, Search, Filter, Check, X, Eye, Clock, AlertCircle } from 'lucide-react';

const adminStats = [
  { label: 'Total Users', value: '2,543', change: '+12%', color: 'text-blue-600' },
  { label: 'Active Listings', value: '186', change: '+8%', color: 'text-emerald-600' },
  { label: 'Mess Subscriptions', value: '1,234', change: '+15%', color: 'text-orange-600' },
  { label: 'Monthly Revenue', value: '₹4.2L', change: '+23%', color: 'text-purple-600' },
];

const recentActivities = [
  { id: 1, type: 'user', message: 'New user registration: Priya Sharma', time: '2 minutes ago' },
  { id: 2, type: 'listing', message: 'New housing listing added in Karol Bagh', time: '15 minutes ago' },
  { id: 3, type: 'mess', message: 'Mess subscription renewed: Central Mess', time: '1 hour ago' },
  { id: 4, type: 'verification', message: 'Property verified: 2BHK Apartment, Hauz Khas', time: '2 hours ago' },
];

const pendingApprovals = [
  { id: 1, type: 'Housing', title: '3BHK House in Lajpat Nagar', user: 'Amit Kumar', date: '2024-01-15' },
  { id: 2, type: 'Mess', title: 'New mess partner application', user: 'Food Court Delhi', date: '2024-01-13' },
];

export default function Admin() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [messRequests, setMessRequests] = useState<any[]>([]);
  const [housingRequests, setHousingRequests] = useState<any[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [showRequestModal, setShowRequestModal] = useState(false);

  useEffect(() => {
    // Subscribe to real-time updates
    const unsubscribeMess = subscribeToMessRequests(setMessRequests);
    const unsubscribeHousing = subscribeToHousingRequests(setHousingRequests);

    return () => {
      unsubscribeMess();
      unsubscribeHousing();
    };
  }, []);

  const TabButton = ({ id, icon: Icon, label }: { id: string; icon: any; label: string }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center space-x-2 px-4 py-3 rounded-xl font-medium transition-colors ${
        activeTab === id
          ? 'bg-blue-600 text-white'
          : 'text-gray-600 hover:bg-gray-100'
      }`}
    >
      <Icon className="w-5 h-5" />
      <span>{label}</span>
    </button>
  );

  const handleApproveRequest = async (type: 'mess' | 'housing', id: string) => {
    try {
      const request = type === 'mess' 
        ? messRequests.find(r => r.id === id)
        : housingRequests.find(r => r.id === id);

      if (type === 'mess') {
        await approveMessRequest(id, request);
        toast.success('Mess request approved! Service is now live.');
      } else {
        await approveHousingRequest(id, request);
        toast.success('Housing request approved! Listing is now live.');
      }
      
      setShowRequestModal(false);
    } catch (error) {
      console.error('Error approving request:', error);
      toast.error('Failed to approve request');
    }
  };

  const handleRejectRequest = async (type: 'mess' | 'housing', id: string) => {
    try {
      const collection = type === 'mess' ? 'messRequests' : 'housingRequests';
      await rejectRequest(collection, id);
      toast.success('Request rejected');
      setShowRequestModal(false);
    } catch (error) {
      console.error('Error rejecting request:', error);
      toast.error('Failed to reject request');
    }
  };

  const viewRequestDetails = (request: any, type: 'mess' | 'housing') => {
    setSelectedRequest({ ...request, type });
    setShowRequestModal(true);
  };
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage users, listings, and platform operations</p>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-3">
          <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
            <Plus className="w-4 h-4 mr-2" />
            Add New
          </button>
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-2 mb-8 overflow-x-auto">
        <TabButton id="dashboard" icon={BarChart3} label="Dashboard" />
        <TabButton id="users" icon={Users} label="Users" />
        <TabButton id="housing" icon={Building} label="Housing" />
        <TabButton id="mess" icon={UtensilsCrossed} label="Mess Services" />
        <TabButton id="requests" icon={Clock} label="Pending Requests" />
      </div>

      {/* Dashboard Content */}
      {activeTab === 'dashboard' && (
        <div className="space-y-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {adminStats.map((stat, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-gray-500">{stat.label}</h3>
                  <span className={`text-sm font-medium ${stat.color}`}>{stat.change}</span>
                </div>
                <div className={`text-3xl font-bold ${stat.color}`}>{stat.value}</div>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Recent Activities */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent Activities</h3>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">{activity.message}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pending Approvals */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Pending Approvals</h3>
              <div className="space-y-4">
                {pendingApprovals.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                          {item.type}
                        </span>
                      </div>
                      <h4 className="font-medium text-gray-900">{item.title}</h4>
                      <p className="text-sm text-gray-500">by {item.user} • {item.date}</p>
                    </div>
                    <div className="flex space-x-2">
                      <button className="px-3 py-1 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors">
                        Approve
                      </button>
                      <button className="px-3 py-1 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors">
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Users Management */}
      {activeTab === 'users' && (
        <div className="space-y-6">
          {/* Search and Filters */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search users..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button className="inline-flex items-center px-6 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors">
                <Filter className="w-5 h-5 mr-2" />
                Filters
              </button>
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">All Users</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {[
                    { name: 'Priya Sharma', email: 'priya@email.com', role: 'Student', status: 'Active' },
                    { name: 'Rohit Kumar', email: 'rohit@email.com', role: 'Student', status: 'Active' },
                    { name: 'Admin User', email: 'admin@campus.com', role: 'Admin', status: 'Active' },
                  ].map((user, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium">
                            {user.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          user.role === 'Admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button className="text-blue-600 hover:text-blue-900 mr-4">Edit</button>
                        <button className="text-red-600 hover:text-red-900">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Other tabs content would be similar... */}
      {activeTab === 'housing' && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Housing Management</h3>
          <p className="text-gray-600">Manage property listings, approvals, and verification status.</p>
        </div>
      )}

      {activeTab === 'mess' && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Mess Services Management</h3>
          <p className="text-gray-600">Manage mess partners, subscriptions, and menu updates.</p>
        </div>
      )}

      {/* Pending Requests Tab */}
      {activeTab === 'requests' && (
        <div className="space-y-8">
          {/* Mess Requests */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <UtensilsCrossed className="w-5 h-5 mr-2" />
                Mess Provider Requests
              </h3>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800">
                {messRequests.filter(r => r.status === 'pending').length} Pending
              </span>
            </div>
            <div className="space-y-4">
              {messRequests.map((request) => (
                <div key={request.id} className="border border-gray-200 rounded-xl p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="font-semibold text-gray-900">{request.providerName}</h4>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          request.status === 'pending' ? 'bg-orange-100 text-orange-800' :
                          request.status === 'approved' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {request.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">Contact: {request.contactPerson}</p>
                      <p className="text-sm text-gray-600 mb-2">Location: {request.address}</p>
                      <p className="text-sm text-gray-500">
                        Submitted: {request.createdAt?.toDate ? new Date(request.createdAt.toDate()).toLocaleDateString() : 'Unknown'}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => viewRequestDetails(request, 'mess')}
                        className="inline-flex items-center px-3 py-1 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </button>
                      {request.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleApproveRequest('mess', request.id)}
                            className="inline-flex items-center px-3 py-1 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors"
                          >
                            <Check className="w-4 h-4 mr-1" />
                            Approve
                          </button>
                          <button
                            onClick={() => handleRejectRequest('mess', request.id)}
                            className="inline-flex items-center px-3 py-1 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
                          >
                            <X className="w-4 h-4 mr-1" />
                            Reject
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Housing Requests */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Building className="w-5 h-5 mr-2" />
                Housing Listing Requests
              </h3>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800">
                {housingRequests.filter(r => r.status === 'pending').length} Pending
              </span>
            </div>
            <div className="space-y-4">
              {housingRequests.map((request) => (
                <div key={request.id} className="border border-gray-200 rounded-xl p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="font-semibold text-gray-900">{request.title}</h4>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          request.status === 'pending' ? 'bg-orange-100 text-orange-800' :
                          request.status === 'approved' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {request.status}
                        </span>
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {request.type.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">Owner: {request.contact.name}</p>
                      <p className="text-sm text-gray-600 mb-2">Location: {request.location}</p>
                      <p className="text-sm text-gray-600 mb-2">Rent: ₹{request.rent.toLocaleString()}/month</p>
                      <p className="text-sm text-gray-500">
                        Submitted: {request.createdAt?.toDate ? new Date(request.createdAt.toDate()).toLocaleDateString() : 'Unknown'}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => viewRequestDetails(request, 'housing')}
                        className="inline-flex items-center px-3 py-1 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </button>
                      {request.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleApproveRequest('housing', request.id)}
                            className="inline-flex items-center px-3 py-1 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors"
                          >
                            <Check className="w-4 h-4 mr-1" />
                            Approve
                          </button>
                          <button
                            onClick={() => handleRejectRequest('housing', request.id)}
                            className="inline-flex items-center px-3 py-1 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
                          >
                            <X className="w-4 h-4 mr-1" />
                            Reject
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Request Details Modal */}
      {showRequestModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  {selectedRequest.type === 'mess' ? 'Mess Provider Details' : 'Housing Listing Details'}
                </h3>
                <button
                  onClick={() => setShowRequestModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {selectedRequest.type === 'mess' ? (
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Basic Information</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Provider Name:</span>
                        <p className="font-medium">{selectedRequest.providerName}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Contact Person:</span>
                        <p className="font-medium">{selectedRequest.contactPerson}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Email:</span>
                        <p className="font-medium">{selectedRequest.email}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Phone:</span>
                        <p className="font-medium">{selectedRequest.phone}</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Address</h4>
                    <p className="text-sm text-gray-700">{selectedRequest.address}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
                    <p className="text-sm text-gray-700">{selectedRequest.description}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Pricing</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>Breakfast: ₹{selectedRequest.pricing.breakfast}/day</div>
                      <div>Lunch: ₹{selectedRequest.pricing.lunch}/day</div>
                      <div>Dinner: ₹{selectedRequest.pricing.dinner}/day</div>
                      <div>Full Day: ₹{selectedRequest.pricing.full}/day</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Property Information</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Title:</span>
                        <p className="font-medium">{selectedRequest.title}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Type:</span>
                        <p className="font-medium capitalize">{selectedRequest.type}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Location:</span>
                        <p className="font-medium">{selectedRequest.location}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Rent:</span>
                        <p className="font-medium">₹{selectedRequest.rent.toLocaleString()}/month</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Deposit:</span>
                        <p className="font-medium">₹{selectedRequest.deposit.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Contact Information</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Contact Person:</span>
                        <p className="font-medium">{selectedRequest.contact.name}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Phone:</span>
                        <p className="font-medium">{selectedRequest.contact.phone}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Email:</span>
                        <p className="font-medium">{selectedRequest.contact.email}</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Owner Details</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Owner Name:</span>
                        <p className="font-medium">{selectedRequest.ownerDetails.name}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Owner Phone:</span>
                        <p className="font-medium">{selectedRequest.ownerDetails.phone}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Owner Email:</span>
                        <p className="font-medium">{selectedRequest.ownerDetails.email}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Owner Address:</span>
                        <p className="font-medium">{selectedRequest.ownerDetails.address}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {selectedRequest.status === 'pending' && (
                <div className="flex space-x-4 mt-8 pt-6 border-t border-gray-200">
                  <button
                    onClick={() => handleApproveRequest(selectedRequest.type, selectedRequest.id)}
                    className="flex-1 inline-flex items-center justify-center px-4 py-3 bg-emerald-600 text-white font-medium rounded-xl hover:bg-emerald-700 transition-colors"
                  >
                    <Check className="w-5 h-5 mr-2" />
                    Approve Request
                  </button>
                  <button
                    onClick={() => handleRejectRequest(selectedRequest.type, selectedRequest.id)}
                    className="flex-1 inline-flex items-center justify-center px-4 py-3 bg-red-600 text-white font-medium rounded-xl hover:bg-red-700 transition-colors"
                  >
                    <X className="w-5 h-5 mr-2" />
                    Reject Request
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}