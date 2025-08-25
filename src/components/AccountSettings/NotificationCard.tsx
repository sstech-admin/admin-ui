import React, { useState } from 'react';
import { Bell, Send, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { NotificationFormData } from './types';
import apiService from '../../services/api';

const NotificationCard: React.FC = () => {
  const [formData, setFormData] = useState<NotificationFormData>({
    title: '',
    message: '',
    userFilter: []  });
  
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length > 100) {
      newErrors.title = 'Title must not exceed 100 characters';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.length > 500) {
      newErrors.message = 'Message must not exceed 500 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof NotificationFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
    if (submitError) {
      setSubmitError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // TODO: Replace with actual API call when available
      console.log('Sending notification:', formData);
      
      // Simulate API call
      await apiService.sendBulkNotification(formData); 
      
      setSubmitSuccess(true);
      showNotification('Notification sent successfully!', 'success');
      
      // Reset form
      setFormData({ title: '', message: '' , userFilter: []});
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 3000);
    } catch (error: any) {
      setSubmitError(error.message || 'Failed to send notification');
      showNotification(error.message || 'Failed to send notification', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const showNotification = (message: string, type: 'success' | 'error') => {
    const toast = document.createElement('div');
    toast.className = `fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg text-white font-medium transition-all duration-300 ${
      type === 'success' ? 'bg-green-500' : 'bg-red-500'
    }`;
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.style.transform = 'translateX(0)';
      toast.style.opacity = '1';
    }, 100);
    
    setTimeout(() => {
      toast.style.transform = 'translateX(100%)';
      toast.style.opacity = '0';
      setTimeout(() => {
        if (document.body.contains(toast)) {
          document.body.removeChild(toast);
        }
      }, 300);
    }, 4000);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
      {/* Header */}
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-3 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-xl">
          <Bell size={24} className="text-blue-600" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">Notification</h3>
          <p className="text-sm text-gray-600">Send notifications to users</p>
        </div>
      </div>

      {/* Success Message */}
      {submitSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
          <div className="flex items-center space-x-3">
            <CheckCircle size={20} className="text-green-600" />
            <div>
              <p className="text-green-800 font-medium">Notification Sent Successfully!</p>
              <p className="text-green-600 text-sm">Your notification has been delivered to all users.</p>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {submitError && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
          <div className="flex items-center space-x-3">
            <AlertCircle size={20} className="text-red-600" />
            <div>
              <p className="text-red-800 font-medium">Error</p>
              <p className="text-red-600 text-sm">{submitError}</p>
            </div>
          </div>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            <span className="text-red-500 mr-1">*</span>
            Title
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            disabled={isSubmitting}
            maxLength={100}
            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white ${
              errors.title ? 'border-red-300 bg-red-50' : 'border-gray-300'
            } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
            placeholder="Enter notification title"
          />
          <div className="flex items-center justify-between mt-1">
            {errors.title ? (
              <p className="text-sm text-red-600 flex items-center">
                <AlertCircle size={16} className="mr-1" />
                {errors.title}
              </p>
            ) : (
              <div></div>
            )}
            <span className="text-sm text-gray-500">
              {formData.title.length} / 100
            </span>
          </div>
        </div>

        {/* Message */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            <span className="text-red-500 mr-1">*</span>
            Message Description
          </label>
          <textarea
            value={formData.message}
            onChange={(e) => handleInputChange('message', e.target.value)}
            disabled={isSubmitting}
            rows={6}
            maxLength={500}
            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white resize-none ${
              errors.message ? 'border-red-300 bg-red-50' : 'border-gray-300'
            } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
            placeholder="Enter notification message description..."
          />
          <div className="flex items-center justify-between mt-1">
            {errors.message ? (
              <p className="text-sm text-red-600 flex items-center">
                <AlertCircle size={16} className="mr-1" />
                {errors.message}
              </p>
            ) : (
              <div></div>
            )}
            <span className="text-sm text-gray-500">
              {formData.message.length} / 500
            </span>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-end pt-6 border-t border-gray-100">
          <button
            type="submit"
            disabled={isSubmitting || !formData.title.trim() || !formData.message.trim()}
            className={`flex items-center space-x-2 px-8 py-3 rounded-xl font-semibold transition-all shadow-lg ${
              isSubmitting || !formData.title.trim() || !formData.message.trim()
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white'
            }`}
          >
            {isSubmitting ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                <span>Sending...</span>
              </>
            ) : (
              <>
                <Send size={20} />
                <span>Send Notification</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NotificationCard;