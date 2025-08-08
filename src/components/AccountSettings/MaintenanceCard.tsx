import React, { useState } from 'react';
import { Settings, Save, Loader2, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { useMaintenance } from './hooks/useMaintenance';
import { MaintenanceUpdatePayload } from './types';

const MaintenanceCard: React.FC = () => {
  const { maintenance, loading, error, updating, updateMaintenance, refetch } = useMaintenance();
  
  const [formData, setFormData] = useState<MaintenanceUpdatePayload>({
    title: '',
    subtitle: '',
    description: '',
    status: 'inactive'
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Update form data when maintenance data loads
  React.useEffect(() => {
    if (maintenance) {
      setFormData({
        title: maintenance.title,
        subtitle: maintenance.subtitle,
        description: maintenance.description,
        status: maintenance.status
      });
    }
  }, [maintenance]);

  const handleInputChange = (field: keyof MaintenanceUpdatePayload, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (submitError) {
      setSubmitError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await updateMaintenance(formData);
      setSubmitSuccess(true);
      setIsEditing(false);
      showNotification('Maintenance settings updated successfully!', 'success');
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 3000);
    } catch (error: any) {
      setSubmitError(error.message || 'Failed to update maintenance settings');
      showNotification(error.message || 'Failed to update maintenance settings', 'error');
    }
  };

  const handleCancel = () => {
    if (maintenance) {
      setFormData({
        title: maintenance.title,
        subtitle: maintenance.subtitle,
        description: maintenance.description,
        status: maintenance.status
      });
    }
    setIsEditing(false);
    setSubmitError(null);
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

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
        <div className="animate-pulse">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gray-200 rounded-xl"></div>
            <div className="h-6 bg-gray-200 rounded w-32"></div>
          </div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-gradient-to-r from-orange-100 to-red-100 rounded-xl">
            <Settings size={24} className="text-orange-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">Maintenance</h3>
            <p className="text-sm text-gray-600">Configure maintenance mode settings</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={refetch}
            disabled={loading || updating}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          </button>
          
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl hover:from-orange-600 hover:to-red-600 transition-all shadow-md text-sm font-medium"
            >
              Edit Settings
            </button>
          )}
        </div>
      </div>

      {/* Success Message */}
      {submitSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
          <div className="flex items-center space-x-3">
            <CheckCircle size={20} className="text-green-600" />
            <div>
              <p className="text-green-800 font-medium">Settings Updated Successfully!</p>
              <p className="text-green-600 text-sm">Maintenance settings have been saved.</p>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {(error || submitError) && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
          <div className="flex items-center space-x-3">
            <AlertCircle size={20} className="text-red-600" />
            <div>
              <p className="text-red-800 font-medium">Error</p>
              <p className="text-red-600 text-sm">{error || submitError}</p>
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
            disabled={!isEditing}
            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all ${
              isEditing ? 'bg-white border-gray-300' : 'bg-gray-50 border-gray-200 text-gray-700'
            }`}
            placeholder="Enter maintenance title"
          />
        </div>

        {/* Subtitle */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            <span className="text-red-500 mr-1">*</span>
            Subtitle
          </label>
          <input
            type="text"
            value={formData.subtitle}
            onChange={(e) => handleInputChange('subtitle', e.target.value)}
            disabled={!isEditing}
            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all ${
              isEditing ? 'bg-white border-gray-300' : 'bg-gray-50 border-gray-200 text-gray-700'
            }`}
            placeholder="Enter maintenance subtitle"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            <span className="text-red-500 mr-1">*</span>
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            disabled={!isEditing}
            rows={4}
            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all resize-none ${
              isEditing ? 'bg-white border-gray-300' : 'bg-gray-50 border-gray-200 text-gray-700'
            }`}
            placeholder="Enter maintenance description"
          />
        </div>

        {/* Status Radio Buttons */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            <span className="text-red-500 mr-1">*</span>
            Status
          </label>
          <div className="grid grid-cols-2 gap-4">
            <label className={`flex items-center justify-center px-4 py-3 border rounded-xl cursor-pointer transition-all ${
              formData.status === 'active' 
                ? 'bg-green-50 border-green-500 text-green-700' 
                : 'border-gray-300 hover:bg-gray-50'
            } ${!isEditing ? 'opacity-60 cursor-not-allowed' : ''}`}>
              <input
                type="radio"
                name="status"
                value="active"
                checked={formData.status === 'active'}
                onChange={(e) => handleInputChange('status', e.target.value)}
                disabled={!isEditing}
                className="sr-only"
              />
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${formData.status === 'active' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                <span className="text-sm font-medium">Active</span>
              </div>
            </label>
            
            <label className={`flex items-center justify-center px-4 py-3 border rounded-xl cursor-pointer transition-all ${
              formData.status === 'inactive' 
                ? 'bg-red-50 border-red-500 text-red-700' 
                : 'border-gray-300 hover:bg-gray-50'
            } ${!isEditing ? 'opacity-60 cursor-not-allowed' : ''}`}>
              <input
                type="radio"
                name="status"
                value="inactive"
                checked={formData.status === 'inactive'}
                onChange={(e) => handleInputChange('status', e.target.value)}
                disabled={!isEditing}
                className="sr-only"
              />
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${formData.status === 'inactive' ? 'bg-red-500' : 'bg-gray-300'}`}></div>
                <span className="text-sm font-medium">Inactive</span>
              </div>
            </label>
          </div>
        </div>

        {/* Last Updated Info */}
        {maintenance && (
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
            <div className="text-sm text-gray-600">
              <span className="font-medium">Last Updated:</span> {formatDate(maintenance.updatedAt)}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        {isEditing && (
          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-100">
            <button
              type="button"
              onClick={handleCancel}
              disabled={updating}
              className="px-6 py-3 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={updating}
              className={`flex items-center space-x-2 px-8 py-3 rounded-xl font-semibold transition-all shadow-lg ${
                updating
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white'
              }`}
            >
              {updating ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  <span>Updating...</span>
                </>
              ) : (
                <>
                  <Save size={20} />
                  <span>Update Settings</span>
                </>
              )}
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default MaintenanceCard;