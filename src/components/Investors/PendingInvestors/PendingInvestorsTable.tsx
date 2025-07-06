import React, { useState, useCallback } from 'react';
import {
  Loader2,
  AlertCircle,
  Clock,
  Search,
  RefreshCw,
  Download,
  Eye,
  CheckCircle,
  XCircle,
  ChevronDown,
  X,
  User,
  Calendar,
  Edit,
  Trash2
} from 'lucide-react';
import { usePendingInvestors } from './hooks/usePendingInvestors';
import { PendingInvestor, PendingInvestorAction } from './types';
import PendingInvestorsPagination from './PendingInvestorsPagination';
import ConfirmationDialog from '../../common/ConfirmationDialog';
import { apiService } from '../../../services/api';
import { useNavigate } from 'react-router-dom';

const PendingInvestorsTable: React.FC = () => {
  const navigate = useNavigate();
  const { investors, loading, error, pagination, filters, setFilters, refetch } = usePendingInvestors();

  const [searchTerm, setSearchTerm] = useState('');
  const [isPaymentSystemOpen, setIsPaymentSystemOpen] = useState(false);
  const [selectedPaymentSystem, setSelectedPaymentSystem] = useState('All');
  const [processingInvestorId, setProcessingInvestorId] = useState<string | null>(null);
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [selectedInvestor, setSelectedInvestor] = useState<PendingInvestor | null>(null);

  const [deleteLoading, setDeleteLoading] = useState(false);

  // Confirmation dialog state
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [investorToDelete, setInvestorToDelete] = useState<PendingInvestor | null>(null);
  // Payment system options
  const paymentSystemOptions = [
    { value: 'All', label: 'All' },
    { value: 'Monthly', label: 'Monthly' },
    { value: 'None', label: 'None' }
  ];

  // Debounced search
  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value);

    const timeoutId = setTimeout(() => {
      setFilters({ search: value, page: 1 });
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [setFilters]);

  const handlePaymentSystemChange = (system: string) => {
    setSelectedPaymentSystem(system);
    setIsPaymentSystemOpen(false);
    setFilters({
      paymentSystem: system === 'All' ? undefined : system,
      page: 1
    });
  };

  const handlePageChange = (page: number) => {
    setFilters({ page });
  };

  const handleLimitChange = (limit: number) => {
    setFilters({ limit, page: 1 });
  };

  const handleRefresh = async () => {
    await refetch();
  };

  const handleExport = () => {
    console.log('Exporting pending investors data...');
    const csvData = investors.map(investor => ({
      'Investor ID': investor.investorId,
      'Name': investor.name,
      'Username': investor.userName,
      'Email': investor.email || '',
      'Phone': investor.phoneNumber || '',
      'Amount': investor.amount,
      'Payment System': investor.paymentSystemName,
      'Investor Type': investor.investorTypeName,
      'PAN Card': investor.panCardNumber,
      'Aadhar Card': investor.aadharCardNumber,
      'Created Date': investor.createdAt ? new Date(investor.createdAt).toLocaleString() : ''
    }));

    const csvString = [
      Object.keys(csvData[0] || {}).join(','),
      ...csvData.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pending-investors-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const clearAllFilters = () => {
    setSelectedPaymentSystem('All');
    setSearchTerm('');
    setFilters({
      search: '',
      paymentSystem: undefined,
      page: 1
    });
  };

  const handleTransactionAction = async (action: PendingInvestorAction) => {
    console.log('Pending investor action:', action);

    if (action.type === 'approve') {
      const investor = investors.find(inv => inv._id === action.investorId);
      if (investor) {
        setSelectedInvestor(investor);
        setIsApproveDialogOpen(true);
      }
    } else if (action.type === 'reject') {
      const investor = investors.find(inv => inv._id === action.investorId);
      if (investor) {
        setSelectedInvestor(investor);
        setIsRejectDialogOpen(true);
      }
    } else if (action.type === 'view') {
      console.log('Viewing investor:', action.investorId);
      // TODO: Implement view investor modal/page
    }
  };


  // Investor action handlers
  const handleViewInvestor = (investorId: string) => {
    console.log('View investor:', investorId);
    navigate(`/investors/${investorId}`);
  };

  const handleEditInvestor = (investorId: string) => {
    console.log('Edit investor:', investorId);
    // Implement edit investor modal/page
      navigate(`/investors/edit/${investorId}`);
  };

  const handleDeleteInvestor = (investorId: string) => {
    console.log('Delete investor:', investorId);
    // Open confirmation dialog
    const investor = investors.find(inv => inv._id === investorId);
      if (investor) {
        setInvestorToDelete(investor);
        setIsConfirmDialogOpen(true);
      }
  };

  const confirmDeleteInvestor = async () => {
    if (!investorToDelete) return;

    try {
      setDeleteLoading(true);

      // Call delete API
      const response = await apiService.delete(`/investor/admin/delete/${investorToDelete._id}`);

      if (response.success) {
        // Show success notification
        showNotification(`Investor ${investorToDelete.name} deleted successfully`, 'success');

        // Refresh the investors list
        await refetch();
      } else {
        throw new Error(response.message || 'Failed to delete investor');
      }
    } catch (error: any) {
      console.error('Error deleting investor:', error);
      showNotification(error.message || 'Failed to delete investor', 'error');
    } finally {
      setDeleteLoading(false);
      setIsConfirmDialogOpen(false);
      setInvestorToDelete(null);
    }
  };

  const cancelDeleteInvestor = () => {
    setIsConfirmDialogOpen(false);
    setInvestorToDelete(null);
  };

  const handleApproveInvestor = async () => {
    if (!selectedInvestor) return;

    try {
      setProcessingInvestorId(selectedInvestor._id);

      // Call API to approve investor
      const response = await apiService.patch(`/investor/admin/approve/${selectedInvestor._id}`);

      if (response.success) {
        showNotification(`Investor ${selectedInvestor.name} approved successfully!`, 'success');
        await refetch();
      } else {
        throw new Error(response.message || 'Failed to approve investor');
      }
    } catch (error: any) {
      console.error('Error approving investor:', error);
      showNotification(error.message || 'Failed to approve investor', 'error');
    } finally {
      setProcessingInvestorId(null);
      setIsApproveDialogOpen(false);
      setSelectedInvestor(null);
    }
  };

  const handleRejectInvestor = async () => {
    if (!selectedInvestor) return;

    try {
      setProcessingInvestorId(selectedInvestor._id);

      // TODO: Implement API call to reject investor
      // await apiService.post(`/investor/admin/reject/${selectedInvestor._id}`);

      showNotification(`Investor ${selectedInvestor.name} rejected successfully!`, 'success');
      await refetch();
    } catch (error: any) {
      console.error('Error rejecting investor:', error);
      showNotification(error.message || 'Failed to reject investor', 'error');
    } finally {
      setProcessingInvestorId(null);
      setIsRejectDialogOpen(false);
      setSelectedInvestor(null);
    }
  };

  const showNotification = (message: string, type: 'success' | 'error') => {
    // Create a simple toast notification
    const toast = document.createElement('div');
    toast.className = `fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg text-white font-medium transition-all duration-300 ${type === 'success' ? 'bg-green-500' : 'bg-red-500'
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

  const formatAmount = (amount: number): string => {
    return new Intl.NumberFormat('en-IN', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString?: string): string => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const getPaymentSystemColor = (paymentSystem: string) => {
    switch (paymentSystem) {
      case 'Monthly':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Weekly':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Quarterly':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Yearly':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'None':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2);
  };

  const hasActiveFilters = selectedPaymentSystem !== 'All' || searchTerm;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-white to-gray-50 px-8 py-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Pending Investors</h2>
            <div className="flex items-center space-x-4 mt-1">
              <p className="text-sm text-gray-600">
                Review and manage pending investor applications
              </p>
              {error && (
                <div className="flex items-center space-x-2 text-red-600">
                  <AlertCircle size={16} />
                  <span className="text-sm">Data loading error</span>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search pending investors..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-10 pr-4 py-2.5 w-80 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all bg-white"
              />
            </div>

            {/* Action Buttons */}
            <button
              onClick={handleRefresh}
              disabled={loading}
              className={`flex items-center space-x-2 px-4 py-2.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors ${loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
            >
              <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
              <span className="text-sm font-medium">{loading ? 'Loading...' : 'Refresh'}</span>
            </button>

            <button
              onClick={handleExport}
              disabled={loading}
              className={`flex items-center space-x-2 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors ${loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
            >
              <Download size={18} />
              <span className="text-sm font-medium">Export</span>
            </button>
          </div>
        </div>

        {/* Filters Row */}
        <div className="mt-6 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Payment System Filter */}
            <div className="relative">
              <button
                onClick={() => setIsPaymentSystemOpen(!isPaymentSystemOpen)}
                disabled={loading}
                className={`flex items-center space-x-2 px-4 py-2.5 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors min-w-[180px] justify-between ${loading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
              >
                <span className="text-sm font-medium text-gray-700">
                  {selectedPaymentSystem}
                </span>
                <ChevronDown size={16} className={`text-gray-400 transition-transform ${isPaymentSystemOpen ? 'rotate-180' : ''}`} />
              </button>

              {isPaymentSystemOpen && !loading && (
                <div className="absolute z-10 w-56 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg">
                  {paymentSystemOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handlePaymentSystemChange(option.value)}
                      className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors first:rounded-t-xl last:rounded-b-xl ${selectedPaymentSystem === option.value ? 'bg-orange-50 text-orange-700' : ''
                        }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Clear Filters */}
            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="flex items-center space-x-2 px-3 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
              >
                <X size={16} />
                <span className="text-sm font-medium">Clear</span>
              </button>
            )}
          </div>

          {/* Stats */}
          <div className="text-sm text-gray-600">
            Total Pending: <span className="font-semibold text-gray-900">{pagination.totalResults}</span>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {(loading || deleteLoading) && (
        <div className="p-12 text-center">
          <div className="flex items-center justify-center space-x-3">
            <Loader2 size={24} className="animate-spin text-orange-500" />
            <span className="text-gray-600">{deleteLoading ? 'Processing delete request...' : 'Loading investors...'}</span>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="p-8">
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle size={20} className="text-red-600" />
              </div>
              <div>
                <h3 className="text-red-800 font-semibold">Error Loading Pending Investors</h3>
                <p className="text-red-600 text-sm">{error}</p>
                <button
                  onClick={handleRefresh}
                  className="mt-2 text-red-600 hover:text-red-800 text-sm font-medium underline"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      {!loading && (
        <div className="overflow-x-auto">
          {investors.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-gray-400 mb-4">
                <Clock size={48} className="mx-auto" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Pending Investors Found</h3>
              <p className="text-gray-600">
                {filters.search || hasActiveFilters
                  ? 'No pending investors found matching your filters.'
                  : 'No pending investor applications at the moment.'
                }
              </p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-8 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Investor
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Investor Type
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Payment System
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {investors.map((investor, index) => (
                  <tr key={investor._id} className={`hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                    <td className="px-8 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-400 rounded-full flex items-center justify-center mr-3">
                          <span className="text-white text-xs font-semibold">
                            {getInitials(investor.name)}
                          </span>
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-gray-900">{investor.name}</div>
                          <div className="text-xs text-gray-500">@{investor.userName}</div>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">
                        <div className="text-gray-900">{investor.investorTypeName}</div>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">
                        <div className="text-xs text-red-500 font-medium">{investor.amountText}</div>
                        <div className="text-lg font-bold text-red-600">
                          ₹{formatAmount(investor.amount)}
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border ${getPaymentSystemColor(investor.paymentSystemName)}`}>
                        {investor.paymentSystemName}
                      </span>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleTransactionAction({ type: 'approve', investorId: investor._id })}
                          className="flex items-center space-x-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                          disabled={processingInvestorId === investor._id}
                        >
                          {processingInvestorId === investor._id ? (
                            <Loader2 size={16} className="animate-spin" />
                          ) : (
                            <CheckCircle size={16} />
                          )}
                          <span className="text-sm font-medium">Approve</span>
                        </button>
                        <button 
                          onClick={() => handleViewInvestor(investor._id)}
                          className="p-2 text-gray-400 hover:text-cyan-600 hover:bg-cyan-50 rounded-lg transition-colors"
                          title="View Investor"
                        >
                          <Eye size={16} />
                        </button>
                        <button 
                          onClick={() => handleEditInvestor(investor._id)}
                          className="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                          title="Edit Investor"
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          onClick={() => handleDeleteInvestor(investor._id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Investor"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Pagination */}
      {!loading && investors.length > 0 && (
        <PendingInvestorsPagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          totalResults={pagination.totalResults}
          limit={pagination.limit}
          hasNext={pagination.hasNext}
          hasPrev={pagination.hasPrev}
          onPageChange={handlePageChange}
          onLimitChange={handleLimitChange}
          loading={loading}
        />
      )}

      {/* Approve Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={isApproveDialogOpen}
        title="Approve Investor"
        message={`Are you sure you want to approve ${selectedInvestor?.name}?`}
        confirmText="Approve"
        cancelText="Cancel"
        onConfirm={handleApproveInvestor}
        onCancel={() => {
          setIsApproveDialogOpen(false);
          setSelectedInvestor(null);
        }}
        type="info"
      />

      {/* Reject Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={isRejectDialogOpen}
        title="Reject Investor"
        message={`Are you sure you want to reject ${selectedInvestor?.name}? This action cannot be undone.`}
        confirmText="Reject"
        cancelText="Cancel"
        onConfirm={handleRejectInvestor}
        onCancel={() => {
          setIsRejectDialogOpen(false);
          setSelectedInvestor(null);
        }}
        type="danger"
      />
      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={isConfirmDialogOpen}
        title={`Are you sure delete this user ${investorToDelete?.name}?`}
        message="Press Yes for Permanent Delete"
        confirmText="Yes"
        cancelText="No"
        onConfirm={confirmDeleteInvestor}
        onCancel={cancelDeleteInvestor}
        type="danger"
      />
    </div>
  );
};

export default PendingInvestorsTable;