import React, { useState } from 'react';
import { X } from 'lucide-react';
import { InvestorProfile } from '../types';
import { apiService } from '../../../../services/api';
import { convertExcel } from '../../../../utils/utils';

interface AddFundsModalProps {
  isOpen: boolean;
  onClose: () => void;
  investor: InvestorProfile | null;
  onSuccess: () => void;
}

const InvestorExportModal: React.FC<AddFundsModalProps> = ({
  isOpen,
  onClose,
  investor,
  onSuccess
}) => {
  // Get today's date in local timezone
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');

  const todayString = `${yyyy}-${mm}-${dd}`;
  const firstDayOfYear = `${yyyy}-01-01`;

  const [fromDate, setFromDate] = useState<string>(firstDayOfYear);
  const [toDate, setToDate] = useState<string>(todayString);

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmittingType, setIsSubmittingType] = useState<string | null>(null);

  if (!isOpen || !investor) return null;

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!fromDate) {
      newErrors.fromDate = 'Please select a from date.';
    }
    if (!toDate) {
      newErrors.toDate = 'Please select a to date.';
    }
    if (fromDate && toDate && new Date(fromDate) > new Date(toDate)) {
      newErrors.dateRange = 'From date cannot be after To date.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleExport = async (type: 'PDF' | 'CSV') => {
    if (!validateForm()) return;

    setIsSubmittingType(type);

    try {
      const response = await apiService.exportInvestorData({
        investorId: investor.id,
        // fromDate,
        // toDate,
        type
      });
      console.log('REs', response)
      convertExcel(
        response?.data?.buffer?.data,
        response?.data?.filename
      )
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Export failed:', error);
      // Optionally show error feedback to user
    } finally {
      setIsSubmittingType(null);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Export</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <div className="p-6 space-y-6">
          {/* From Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <span className="text-red-500">*</span> From Date
            </label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all bg-white text-gray-900"
            />
            {errors.fromDate && (
              <p className="text-red-500 text-sm mt-1">{errors.fromDate}</p>
            )}
          </div>

          {/* To Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <span className="text-red-500">*</span> To Date
            </label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all bg-white text-gray-900"
            />
            {errors.toDate && (
              <p className="text-red-500 text-sm mt-1">{errors.toDate}</p>
            )}
          </div>

          {/* Date Range Error */}
          {errors.dateRange && (
            <p className="text-red-500 text-sm">{errors.dateRange}</p>
          )}

          {/* Export Buttons */}
          <div className="pt-4 flex justify-between gap-4">
            <button
              type="button"
              disabled={isSubmittingType === 'PDF'}
              onClick={() => handleExport('PDF')}
              className={`w-full py-3 px-4 rounded-xl font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all shadow-lg ${
                isSubmittingType === 'PDF'
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:from-cyan-600 hover:to-blue-600'
              }`}
            >
              {isSubmittingType === 'PDF' ? 'Processing...' : 'Export PDF'}
            </button>

            <button
              type="button"
              disabled={isSubmittingType === 'EXCEL'}
              onClick={() => handleExport('CSV')}
              className={`w-full py-3 px-4 rounded-xl font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all shadow-lg ${
                isSubmittingType === 'EXCEL'
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600'
              }`}
            >
              {isSubmittingType === 'EXCEL' ? 'Processing...' : 'Export Excel'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvestorExportModal;
