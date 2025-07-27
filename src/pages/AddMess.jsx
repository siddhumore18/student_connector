import React, { useState } from 'react';
import { addMessRequest } from '../services/firebase.js';
import { useAuth } from '../contexts/AuthContext.jsx';
import toast from 'react-hot-toast';
import { UtensilsCrossed, Upload, Plus, X, DollarSign, MapPin, Phone, Mail, User, FileText } from 'lucide-react';

export default function AddMess() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    providerName: '',
    contactPerson: '',
    email: '',
    phone: '',
    address: '',
    description: '',
    todaysMenu: [''],
    weekSpecial: [''],
    subscriptionPlans: [''],
    pricing: {
      breakfast: '',
      lunch: '',
      dinner: '',
      full: '',
    },
    documents: [],
  });

  // Handlers for dynamic fields
  const addToArray = (field) => {
    setFormData({ ...formData, [field]: [...formData[field], ''] });
  };
  const removeFromArray = (field, index) => {
    setFormData({ ...formData, [field]: formData[field].filter((_, i) => i !== index) });
  };
  const updateArray = (field, index, value) => {
    const arr = [...formData[field]];
    arr[index] = value;
    setFormData({ ...formData, [field]: arr });
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const dataToSend = {
      ...formData,
      menu: {
        today: formData.todaysMenu.filter(Boolean),
        weekSpecial: formData.weekSpecial.filter(Boolean),
      },
      subscriptionPlans: formData.subscriptionPlans.filter(Boolean),
      submittedBy: user?.id,
      submitterName: user?.name,
      submitterEmail: user?.email,
    };
    console.log('Submitting mess service request:', dataToSend);
    try {
      await addMessRequest(dataToSend);
      toast.success('Mess service request submitted successfully! Awaiting admin approval.');
      setSubmitted(true);
    } catch (error) {
      console.error('Error submitting mess service request:', error);
      toast.error('Failed to submit mess service request: ' + (error?.message || error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const addDocument = () => {
    setFormData({
      ...formData,
      documents: [...formData.documents, '']
    });
  };

  const removeDocument = (index) => {
    setFormData({
      ...formData,
      documents: formData.documents.filter((_, i) => i !== index)
    });
  };

  const updateDocument = (index, value) => {
    const newDocuments = [...formData.documents];
    newDocuments[index] = value;
    setFormData({
      ...formData,
      documents: newDocuments
    });
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <UtensilsCrossed className="w-8 h-8 text-emerald-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Request Submitted Successfully!</h2>
          <p className="text-gray-600 mb-6">
            Your mess provider application has been submitted for review. Our admin team will review your request and get back to you within 2-3 business days.
          </p>
          <div className="bg-blue-50 rounded-xl p-4 mb-6">
            <h3 className="font-semibold text-blue-900 mb-2">What happens next?</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Admin team reviews your application</li>
              <li>• Verification of documents and details</li>
              <li>• Site inspection (if required)</li>
              <li>• Approval notification via email</li>
            </ul>
          </div>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <UtensilsCrossed className="w-8 h-8 text-emerald-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Register Your Mess Service</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Join our platform to provide quality meal services to students. Fill out the form below to submit your application for admin review.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
            <User className="w-5 h-5 mr-2" />
            Basic Information
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Mess/Restaurant Name *</label>
              <input
                type="text"
                required
                value={formData.providerName}
                onChange={(e) => setFormData({ ...formData, providerName: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="Enter your mess name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Contact Person *</label>
              <input
                type="text"
                required
                value={formData.contactPerson}
                onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="Owner/Manager name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="your@email.com"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="+91 98765 43210"
                />
              </div>
            </div>
          </div>
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Complete Address *</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
              <textarea
                required
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                rows={3}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="Enter complete address with landmarks"
              />
            </div>
          </div>
        </div>

        {/* Service Details */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
            <FileText className="w-5 h-5 mr-2" />
            Service Details
          </h3>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
              <textarea
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="Describe your mess service, specialties, and what makes you unique..."
              />
            </div>
            {/* Today's Menu */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
              <h3 className="text-lg font-semibold text-blue-700 mb-4 flex items-center">
                Today's Menu
              </h3>
              <div className="space-y-2">
                {formData.todaysMenu.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="text"
                      required
                      value={item}
                      onChange={e => updateArray('todaysMenu', idx, e.target.value)}
                      className="flex-1 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g. Paneer Butter Masala"
                    />
                    <button type="button" onClick={() => removeFromArray('todaysMenu', idx)} className="p-2 text-red-500 hover:bg-red-50 rounded-xl"><X className="w-4 h-4" /></button>
                  </div>
                ))}
                <button type="button" onClick={() => addToArray('todaysMenu')} className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors mt-2"><Plus className="w-4 h-4 mr-2" />Add Menu Item</button>
              </div>
            </div>
            {/* Week's Special Menu */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
              <h3 className="text-lg font-semibold text-blue-700 mb-4 flex items-center">
                This Week's Special Menu
              </h3>
              <div className="space-y-2">
                {formData.weekSpecial.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="text"
                      required
                      value={item}
                      onChange={e => updateArray('weekSpecial', idx, e.target.value)}
                      className="flex-1 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g. Monday: Chole Bhature"
                    />
                    <button type="button" onClick={() => removeFromArray('weekSpecial', idx)} className="p-2 text-red-500 hover:bg-red-50 rounded-xl"><X className="w-4 h-4" /></button>
                  </div>
                ))}
                <button type="button" onClick={() => addToArray('weekSpecial')} className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors mt-2"><Plus className="w-4 h-4 mr-2" />Add Special</button>
              </div>
            </div>
            {/* Subscription Plans */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
              <h3 className="text-lg font-semibold text-blue-700 mb-4 flex items-center">
                Subscription Plans
              </h3>
              <div className="space-y-2">
                {formData.subscriptionPlans.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="text"
                      required
                      value={item}
                      onChange={e => updateArray('subscriptionPlans', idx, e.target.value)}
                      className="flex-1 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g. Monthly: ₹3000"
                    />
                    <button type="button" onClick={() => removeFromArray('subscriptionPlans', idx)} className="p-2 text-red-500 hover:bg-red-50 rounded-xl"><X className="w-4 h-4" /></button>
                  </div>
                ))}
                <button type="button" onClick={() => addToArray('subscriptionPlans')} className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors mt-2"><Plus className="w-4 h-4 mr-2" />Add Plan</button>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
            <DollarSign className="w-5 h-5 mr-2" />
            Pricing Plans
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Breakfast (₹/day)</label>
              <input
                type="number"
                required
                value={formData.pricing.breakfast}
                onChange={(e) => setFormData({
                  ...formData,
                  pricing: { ...formData.pricing, breakfast: e.target.value }
                })}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="150"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Lunch (₹/day)</label>
              <input
                type="number"
                required
                value={formData.pricing.lunch}
                onChange={(e) => setFormData({
                  ...formData,
                  pricing: { ...formData.pricing, lunch: e.target.value }
                })}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="180"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Dinner (₹/day)</label>
              <input
                type="number"
                required
                value={formData.pricing.dinner}
                onChange={(e) => setFormData({
                  ...formData,
                  pricing: { ...formData.pricing, dinner: e.target.value }
                })}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="160"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Day (₹/day)</label>
              <input
                type="number"
                required
                value={formData.pricing.full}
                onChange={(e) => setFormData({
                  ...formData,
                  pricing: { ...formData.pricing, full: e.target.value }
                })}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="450"
              />
            </div>
          </div>
        </div>

        {/* Documents */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
            <Upload className="w-5 h-5 mr-2" />
            Required Documents
          </h3>
          <div className="space-y-4">
            {formData.documents.map((doc, index) => (
              <div key={index} className="flex items-center space-x-3">
                <input
                  type="text"
                  value={doc}
                  onChange={(e) => updateDocument(index, e.target.value)}
                  className="flex-1 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="Document name or URL"
                />
                <button
                  type="button"
                  onClick={() => removeDocument(index)}
                  className="p-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addDocument}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Document
            </button>
          </div>
          <div className="mt-4 p-4 bg-blue-50 rounded-xl">
            <h4 className="font-medium text-blue-900 mb-2">Required Documents:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Business registration certificate</li>
              <li>• Food safety license (FSSAI)</li>
              <li>• Identity proof of owner</li>
              <li>• Address proof of establishment</li>
              <li>• Sample photos of kitchen and dining area</li>
            </ul>
          </div>
        </div>

        {/* Submit */}
        <div className="text-center">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center px-8 py-4 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Submitting Request...
              </>
            ) : (
              <>
                <UtensilsCrossed className="w-5 h-5 mr-2" />
                Submit for Review
              </>
            )}
          </button>
          <p className="text-sm text-gray-500 mt-3">
            By submitting, you agree to our terms and conditions for mess service providers.
          </p>
        </div>
      </form>
    </div>
  );
}
