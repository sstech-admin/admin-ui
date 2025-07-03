import React, { useState, useRef } from 'react';
import { X, Upload, Calendar, FileText, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { apiService } from '../../../services/api';

interface TDSCertificateUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  investorId: string;
  onSuccess: () => void;
}

interface FormData {
  fromDate: string;
  toDate: string;
  remarks: string;
  file: File | null;
}

const TDSCertificateUploadModal: React.FC<TDSCertificateUploadModalProps> = ({ 
  isOpen, 
  onClose, 
  investorId,
  onSuccess 
}) => {
  const [formData, setFormData] = useState<FormData>({
    fromDate: '',
    toDate: '',
    remarks: '',
    file: null
  });
  
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const validateForm = (): boolean => {
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.fromDate) {
      newErrors.fromDate = 'From date is required';
    }
    
    if (!formData.toDate) {
      newErrors.toDate = 'To date is required';
    } else if (formData.fromDate && new Date(formData.toDate) < new Date(formData.fromDate)) {
      newErrors.toDate = 'To date must be after from date';
    }
    
    if (!formData.file) {
      newErrors.file = 'TDS certificate file is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      // Create FormData for file upload
      const submitData = new FormData();
      submitData.append('investorId', investorId);
      
      if (formData.remarks) {
        submitData.append('remarks', formData.remarks);
      }
      
      if (formData.fromDate) {
        const fromDateTime = new Date(formData.fromDate);
        submitData.append('fromDate', fromDateTime.toISOString());
      }
      
      if (formData.toDate) {
        const toDateTime = new Date(formData.toDate);
        submitData.append('toDate', toDateTime.toISOString());
      }
      
      if (formData.file) {
        submitData.append('tdsCertificateFile', formData.file);
      }
      
      console.log('Uploading TDS certificate with payload:', {
        userId: investorId,
        remarks: formData.remarks,
        fromDate: formData.fromDate ? new Date(formData.fromDate).toISOString() : null,
        toDate: formData.toDate ? new Date(formData.toDate).toISOString() : null,
        file: formData.file ? formData.file.name : null
      });
      
      // Call API
      const response = await apiService.uploadTdsCertificate(submitData);
      
      if (response.success) {
        setSubmitSuccess(true);
        showNotification('TDS certificate uploaded successfully!', 'success');
        
        // Reset form
        setTimeout(() => {
          setFormData({
            fromDate: '',
            toDate: '',
            remarks: '',
            file: null
          });
          setSubmitSuccess(false);
          onSuccess();
          onClose();
        }, 2000);
      } else {
        throw new Error(response.message || 'Failed to upload TDS certificate');
      }
    } catch (error: any) {
      console.error('Error uploading TDS certificate:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to upload TDS certificate';
      setSubmitError(errorMessage);
      showNotification(errorMessage, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, file }));
      if (errors.file) {
        setErrors(prev => ({ ...prev, file: '' }));
      }
    }
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const showNotification = (message: string, type: 'success' | 'error') => {
    // Create a simple toast notification
    const toast = document.createElement('div');
    toast.className = `fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg text-white font-medium transition-all duration-300 ${
      type === 'success' ? 'bg-green-500' : 'bg-red-500'
    }`;
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    // Animate in
    setTimeout(() => {
      toast.style.transform = 'translateX(0)';
      toast.style.opacity = '1';
    }, 100);
    
    // Remove after 4 seconds
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Upload TDS Certificate</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
            disabled={isSubmitting}
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Success Message */}
          {submitSuccess && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <div className="flex items-center space-x-3">
                <CheckCircle size={20} className="text-green-600" />
                <div>
                  <p className="text-green-800 font-medium">TDS certificate uploaded successfully!</p>
                </div>
              </div>
            </div>
          )}
          
          {/* Error Message */}
          {submitError && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <div className="flex items-center space-x-3">
                <AlertCircle size={20} className="text-red-600" />
                <div>
                  <p className="text-red-800 font-medium">Error</p>
                  <p className="text-red-600 text-sm">{submitError}</p>
                </div>
              </div>
            </div>
          )}
          
          {/* From Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <span className="text-red-500 mr-1">*</span>
              From Date
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="date"
                value={formData.fromDate}
                onChange={(e) => handleInputChange('fromDate', e.target.value)}
                className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white ${
                  errors.fromDate ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                disabled={isSubmitting}
              />
            </div>
            {errors.fromDate && (
              <p className="mt-2 text-sm text-red-600">{errors.fromDate}</p>
            )}
          </div>
          
          {/* To Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <span className="text-red-500 mr-1">*</span>
              To Date
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="date"
                value={formData.toDate}
                onChange={(e) => handleInputChange('toDate', e.target.value)}
                className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white ${
                  errors.toDate ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                disabled={isSubmitting}
              />
            </div>
            {errors.toDate && (
              <p className="mt-2 text-sm text-red-600">{errors.toDate}</p>
            )}
          </div>
          
          {/* Remarks */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Remarks
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-4 text-gray-400" size={20} />
              <textarea
                value={formData.remarks}
                onChange={(e) => handleInputChange('remarks', e.target.value)}
                placeholder="Enter any remarks or notes about this certificate..."
                rows={3}
                className="w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
                disabled={isSubmitting}
              />
            </div>
          </div>
          
          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <span className="text-red-500 mr-1">*</span>
              TDS Certificate File
            </label>
            <div 
              className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                errors.file 
                  ? 'border-red-300 bg-red-50' 
                  : formData.file 
                  ? 'border-green-300 bg-green-50' 
                  : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
              }`}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileChange}
                className="hidden"
                disabled={isSubmitting}
              />
              
              {formData.file ? (
                <div className="flex items-center justify-center space-x-3">
                  <FileText size={24} className="text-green-600" />
                  <div className="flex-1 text-left">
                    <p className="text-sm font-medium text-green-800">{formData.file.name}</p>
                    <p className="text-xs text-green-600">
                      {(formData.file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setFormData(prev => ({ ...prev, file: null }));
                    }}
                    className="p-1 text-red-500 hover:text-red-700 hover:bg-red-100 rounded-full transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Upload size={32} className="mx-auto text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Upload TDS Certificate</p>
                    <p className="text-xs text-gray-500">PDF, JPG, PNG up to 10MB</p>
                  </div>
                </div>
              )}
            </div>
            {errors.file && (
              <p className="mt-2 text-sm text-red-600">{errors.file}</p>
            )}
          </div>
          
          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting || submitSuccess}
              className={`w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-xl font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all shadow-lg ${
                isSubmitting || submitSuccess
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-600 hover:to-indigo-600'
              }`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  <span>Uploading...</span>
                </>
              ) : submitSuccess ? (
                <>
                  <CheckCircle size={20} />
                  <span>Uploaded!</span>
                </>
              ) : (
                <>
                  <Upload size={20} />
                  <span>Upload Certificate</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TDSCertificateUploadModal;