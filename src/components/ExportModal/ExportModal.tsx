import React, { useState } from 'react';
import { X } from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (data: {
    fromDate: string;
    toDate: string;
    type: 'PDF' | 'CSV';
    filters?: any;
  }) => void;
  showPDF?: boolean;
  showExcel?: boolean;
  extraFiltersContent?: React.ReactNode;
  extraFiltersData?: any;
  defaultFromDate?: string;
  defaultToDate?: string;
}

const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  onExport,
  showPDF = true,
  showExcel = true,
  extraFiltersContent,
  extraFiltersData,
  defaultFromDate,
  defaultToDate,
}) => {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  const todayStr = `${yyyy}-${mm}-${dd}`;
  const firstDayOfYear = `${yyyy}-01-01`;

  const [fromDate, setFromDate] = useState(defaultFromDate || firstDayOfYear);
  const [toDate, setToDate] = useState(defaultToDate || todayStr);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmittingType, setIsSubmittingType] = useState<'PDF' | 'CSV' | null>(null);

  if (!isOpen) return null;

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!fromDate) newErrors.fromDate = 'Please select a from date.';
    if (!toDate) newErrors.toDate = 'Please select a to date.';
    if (fromDate && toDate && new Date(fromDate) > new Date(toDate)) {
      newErrors.dateRange = 'From date cannot be after To date.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleExportClick = (type: 'PDF' | 'CSV') => {
    if (!validateForm()) return;

    setIsSubmittingType(type);
    onExport({
      fromDate,
      toDate,
      type,
      filters: extraFiltersData || {},
    });
    setIsSubmittingType(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[calc(100vh-4rem)] overflow-y-auto">

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
        <div className="p-6 space-y-4">
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
            {errors.fromDate && <p className="text-red-500 text-sm mt-1">{errors.fromDate}</p>}
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
            {errors.toDate && <p className="text-red-500 text-sm mt-1">{errors.toDate}</p>}
          </div>

          {/* Date Range Error */}
          {errors.dateRange && <p className="text-red-500 text-sm">{errors.dateRange}</p>}

          {/* Extra Filters */}
          {extraFiltersContent}

          {/* Export Buttons */}
          <div className="pt-4 flex justify-between gap-4">
            {showPDF && (
              <button
                type="button"
                disabled={isSubmittingType === 'PDF'}
                onClick={() => handleExportClick('PDF')}
                className={`w-full py-3 px-4 rounded-xl font-semibold transition-all shadow-lg ${
                  isSubmittingType === 'PDF'
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:from-cyan-600 hover:to-blue-600'
                }`}
              >
                {isSubmittingType === 'PDF' ? 'Processing...' : 'Export PDF'}
              </button>
            )}
            {showExcel && (
              <button
                type="button"
                disabled={isSubmittingType === 'CSV'}
                onClick={() => handleExportClick('CSV')}
                className={`w-full py-3 px-4 rounded-xl font-semibold transition-all shadow-lg ${
                  isSubmittingType === 'CSV'
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600'
                }`}
              >
                {isSubmittingType === 'CSV' ? 'Processing...' : 'Export Excel'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportModal;
