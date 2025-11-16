import React, { useState, useEffect } from 'react';
import { ArrowLeft, Loader2, CheckCircle, AlertCircle, UserX, Users, LogOut } from 'lucide-react';
import { useInvestors } from '../AddTransaction/hooks/useInvestors';
import { Investor } from '../AddTransaction/types';
import { apiService } from '../../services/api';
import InvestorDropdown from '../AddTransaction/InvestorDropdown';
import ConfirmationDialog from '../common/ConfirmationDialog';

interface AddTransactionFormProps {
  onBack: () => void;
}

const ManageSessions: React.FC<AddTransactionFormProps> = ({ onBack }) => {
  const { investors, loading: loadingInvestors, error: investorsError, searchInvestors } = useInvestors();
  
  // Single user logout state
  const [selectedInvestor, setSelectedInvestor] = useState<Investor | null>(null);
  const [singleUserError, setSingleUserError] = useState<string | null>(null);
  const [isLoggingOutSingleUser, setIsLoggingOutSingleUser] = useState(false);
  const [singleUserSuccess, setSingleUserSuccess] = useState(false);
  const [showSingleUserConfirm, setShowSingleUserConfirm] = useState(false);

  // All users logout state
  const [allUsersError, setAllUsersError] = useState<string | null>(null);
  const [isLoggingOutAllUsers, setIsLoggingOutAllUsers] = useState(false);
  const [allUsersSuccess, setAllUsersSuccess] = useState(false);
  const [showAllUsersConfirm, setShowAllUsersConfirm] = useState(false);

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
        document.body.removeChild(toast);
      }, 300);
    }, 4000);
  };

  // Handle all users logout confirmation
  const handleLogoutAllUsersClick = () => {
    setShowAllUsersConfirm(true);
  };

  // Handle all users logout (actual API call)
  const handleLogoutAllUsers = async () => {
    setShowAllUsersConfirm(false);
    setIsLoggingOutAllUsers(true);
    setAllUsersError(null);
    setAllUsersSuccess(false);

    try {
      const response = await apiService.logoutAllUsers();
      
      if (response.success) {
        setAllUsersSuccess(true);
        showNotification('All users logged out successfully!', 'success');
        
        // Reset success message after 3 seconds
        setTimeout(() => {
          setAllUsersSuccess(false);
        }, 3000);
      } else {
        throw new Error(response.message || 'Failed to logout all users');
      }
    } catch (error: any) {
      console.error('Error logging out all users:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to logout all users. Please try again.';
      setAllUsersError(errorMessage);
      showNotification(errorMessage, 'error');
    } finally {
      setIsLoggingOutAllUsers(false);
    }
  };

  // Handle single user logout confirmation
  const handleLogoutSingleUserClick = () => {
    if (!selectedInvestor) {
      setSingleUserError('Please select an investor');
      return;
    }
    setShowSingleUserConfirm(true);
  };

  // Handle single user logout (actual API call)
  const handleLogoutSingleUser = async () => {
    setShowSingleUserConfirm(false);
    
    if (!selectedInvestor) {
      setSingleUserError('Please select an investor');
      return;
    }

    setIsLoggingOutSingleUser(true);
    setSingleUserError(null);
    setSingleUserSuccess(false);

    try {
      const response = await apiService.logoutUser(selectedInvestor._id);
      
      if (response.success) {
        setSingleUserSuccess(true);
        showNotification(`User ${selectedInvestor.name} logged out successfully!`, 'success');
        
        // Reset form
        setSelectedInvestor(null);
        
        // Reset success message after 3 seconds
        setTimeout(() => {
          setSingleUserSuccess(false);
        }, 3000);
      } else {
        throw new Error(response.message || 'Failed to logout user');
      }
    } catch (error: any) {
      console.error('Error logging out user:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to logout user. Please try again.';
      setSingleUserError(errorMessage);
      showNotification(errorMessage, 'error');
    } finally {
      setIsLoggingOutSingleUser(false);
    }
  };

  const handleInvestorSelect = (investor: Investor) => {
    setSelectedInvestor(investor);
    if (singleUserError) {
      setSingleUserError(null);
    }
  };

  // Auto-clear error messages after 3-5 seconds
  useEffect(() => {
    if (singleUserError) {
      const timer = setTimeout(() => {
        setSingleUserError(null);
      }, 4000); // 4 seconds (between 2-5 seconds as requested)
      
      return () => clearTimeout(timer);
    }
  }, [singleUserError]);

  useEffect(() => {
    if (allUsersError) {
      const timer = setTimeout(() => {
        setAllUsersError(null);
      }, 4000); // 4 seconds (between 2-5 seconds as requested)
      
      return () => clearTimeout(timer);
    }
  }, [allUsersError]);

  return (
    <>
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Manage Sessions</h1>
            <p className="text-gray-600">Manage user sessions and logout users</p>
          </div>
        </div>
      </div>

      {/* All Users Logout Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-3 bg-gradient-to-r from-red-100 to-orange-100 rounded-xl">
            <Users size={24} className="text-red-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">All Users Logout</h2>
            <p className="text-gray-600">Logout all active user sessions at once</p>
          </div>
        </div>

        {/* Success Message */}
        {allUsersSuccess && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4">
            <div className="flex items-center space-x-3">
              <CheckCircle size={20} className="text-green-600" />
              <p className="text-green-800 font-medium">All users logged out successfully!</p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {allUsersError && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
            <div className="flex items-center space-x-3">
              <AlertCircle size={20} className="text-red-600" />
              <p className="text-red-800">{allUsersError}</p>
            </div>
          </div>
        )}

        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center justify-between gap-4">
          <p className="text-sm text-red-800 flex-1">
            <strong>Warning:</strong> This action will logout all active users from their sessions. This action cannot be undone.
          </p>
          <button
            onClick={handleLogoutAllUsersClick}
            disabled={isLoggingOutAllUsers || allUsersSuccess}
            className={`flex items-center justify-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all shadow-lg whitespace-nowrap ${
              isLoggingOutAllUsers || allUsersSuccess
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white'
            }`}
          >
            {isLoggingOutAllUsers ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                <span>Logging out...</span>
              </>
            ) : allUsersSuccess ? (
              <>
                <CheckCircle size={20} />
                <span>Logged Out!</span>
              </>
            ) : (
              <>
                <LogOut size={20} />
                <span>Logout All Users</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Single User Logout Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-3 bg-gradient-to-r from-orange-100 to-red-100 rounded-xl">
            <UserX size={24} className="text-orange-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Single User Logout</h2>
            <p className="text-gray-600">Select an investor to logout their session</p>
          </div>
        </div>

        {/* Success Message */}
        {singleUserSuccess && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4">
            <div className="flex items-center space-x-3">
              <CheckCircle size={20} className="text-green-600" />
              <p className="text-green-800 font-medium">User logged out successfully!</p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {singleUserError && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
            <div className="flex items-center space-x-3">
              <AlertCircle size={20} className="text-red-600" />
              <p className="text-red-800">{singleUserError}</p>
            </div>
          </div>
        )}

        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
          <div className="flex items-start gap-4">
            {/* Investor Dropdown */}
            <div className="flex-1">
              <InvestorDropdown
                investors={investors}
                selectedInvestor={selectedInvestor}
                onSelect={handleInvestorSelect}
                onSearch={searchInvestors}
                loading={loadingInvestors}
                error={investorsError || undefined}
                required
              />
            </div>

            {/* Logout Button */}
            <div className={!selectedInvestor ? "pt-8" : "pt-10"}>
              <button
                onClick={handleLogoutSingleUserClick}
                disabled={isLoggingOutSingleUser || singleUserSuccess || !selectedInvestor}
                className={`flex items-center justify-center space-x-2 px-6 py-4 rounded-xl font-semibold transition-all shadow-lg whitespace-nowrap h-[56px] ${
                  isLoggingOutSingleUser || singleUserSuccess || !selectedInvestor
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white'
                }`}
              >
            {isLoggingOutSingleUser ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                <span>Logging out...</span>
              </>
            ) : singleUserSuccess ? (
              <>
                <CheckCircle size={20} />
                <span>Logged Out!</span>
              </>
            ) : (
              <>
                <LogOut size={20} />
                <span>Logout User</span>
              </>
            )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>


      {/* All Users Logout Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={showAllUsersConfirm}
        title="Logout All Users"
        message="Are you sure you want to logout all active users? This action will terminate all active sessions and cannot be undone."
        confirmText="Yes, Logout All"
        cancelText="Cancel"
        onConfirm={handleLogoutAllUsers}
        onCancel={() => setShowAllUsersConfirm(false)}
        type="danger"
      />

      {/* Single User Logout Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={showSingleUserConfirm}
        title="Logout User"
        message={`Are you sure you want to logout ${selectedInvestor?.name || 'this user'}? This action will terminate their active session.`}
        confirmText="Yes, Logout"
        cancelText="Cancel"
        onConfirm={handleLogoutSingleUser}
        onCancel={() => setShowSingleUserConfirm(false)}
        type="warning"
      />
      </>
  );
};

export default ManageSessions;
