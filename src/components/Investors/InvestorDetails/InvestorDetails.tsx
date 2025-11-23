import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Loader2, AlertCircle } from 'lucide-react';
import { useInvestorProfile } from './hooks/useInvestorProfile';
import { useTDSCertificates } from './hooks/useTDSCertificates';
import { useInvestorTransactions } from './hooks/useInvestorTransactions';
import { useExportInvestor } from './hooks/useExportInvestor';
import InvestorHeader from './InvestorHeader';
import InvestorProfileCard from './InvestorProfileCard';
import BankDetailsCard from './BankDetailsCard';
import DocumentsCard from './DocumentsCard';
import TDSCertificatesCard from './TDSCertificatesCard';
import TransactionsCard from './TransactionsCard';
import AddFundsModal from './modals/AddFundsModal';
import WithdrawFundsModal from './modals/WithdrawFundsModal';
import InvestorExportModal from './modals/InvestorExportModal';
import InvestmentDataCard from './InvestmentDataCard';
import { apiService } from '../../../services/api';

const InvestorDetails: React.FC = () => {
  const { investorId } = useParams<{ investorId: string }>();
  
  const { 
    profile, 
    loading: loadingProfile, 
    error: profileError, 
    refetch: refetchProfile 
  } = useInvestorProfile(investorId || '');
  
  const {
    certificates,
    loading: loadingCertificates,
    error: certificatesError,
    refetch: refetchCertificates,
    selectedYear,
    setSelectedYear
  } = useTDSCertificates(investorId || '');
  
  const {
    transactions,
    loading: loadingTransactions,
    error: transactionsError,
    pagination,
    setFilters,
    refetch: refetchTransactions
  } = useInvestorTransactions(investorId || '');

  const { exportInvestor } = useExportInvestor();

  // Modal states
  const [isAddFundsModalOpen, setIsAddFundsModalOpen] = useState(false);
  const [isInvestorExportModalOpen, setIsInvestorExportModalOpen] = useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);

  
  // Investment data state
  const [investmentData, setInvestmentData] = useState<{
    invested5050: number;
    invested6040: number;
    profit5050: number;
    profit6040: number;
    totalInvested: number;
    returnPercentage: number;
  } | null>(null);

  // Call investmentData API
  useEffect(() => {
    const callInvestmentData = async () => {
      if (investorId) {
        try {
          const response = await apiService.investmentData(investorId);
          console.log('investmentData API Response:', response);
          
          if (response.success && response.data) {
            setInvestmentData({
              invested5050: response.data.invested5050 || 0,
              invested6040: response.data.invested6040 || 0,
              profit5050: response.data.profit5050 || 0,
              profit6040: response.data.profit6040 || 0,
              totalInvested: response.data.totalInvested || 0,
              returnPercentage: response.data.returnPercentage || 0,
            });
          }
        } catch (error) {
          console.error('Error calling investmentData API:', error);
        }
      }
    };

    callInvestmentData();
  }, [investorId]);


  // Handle page change for transactions
  const handleTransactionPageChange = (page: number) => {
    setFilters({ page });
  };

  // Handle refresh all data
  const handleRefresh = () => {
    refetchProfile();
    refetchCertificates();
    refetchTransactions();
  };

  // Handle year change for TDS certificates
  const handleYearChange = (year: string) => {
    setSelectedYear(year);
    refetchCertificates(year);
  };

  // Handle export
  const handleExport = async () => {
    if (investorId) {
      await exportInvestor(investorId);
    }
  };

  // Handle modal success
  const handleModalSuccess = () => {
    refetchProfile();
    refetchTransactions();
  };

  // If no investorId is provided, show error
  if (!investorId) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-8 my-6">
        <div className="flex items-center space-x-3">
          <AlertCircle size={24} className="text-red-600" />
          <div>
            <h3 className="text-red-800 font-semibold">Error Loading Investor</h3>
            <p className="text-red-600">No investor ID provided</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <InvestorHeader 
        profile={profile} 
        loading={loadingProfile} 
        error={profileError} 
        onRefresh={handleRefresh}
        onAddFunds={() => setIsAddFundsModalOpen(true)}
        onWithdraw={() => setIsWithdrawModalOpen(true)}
        onStatement={() => {
          // TODO: Implement statement functionality
          alert('Statement functionality is not implemented yet');
        }}
        onExport={()=>{setIsInvestorExportModalOpen(true)}}
      />
      
      {/* Main Loading State */}
      {loadingProfile && !profile && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
          <div className="flex flex-col items-center justify-center">
            <Loader2 size={48} className="animate-spin text-cyan-500 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Loading Investor Details</h3>
            <p className="text-gray-600">Please wait while we fetch the investor information...</p>
          </div>
        </div>
      )}
      
      {/* Main Error State */}
      {profileError && !loadingProfile && !profile && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-8">
          <div className="flex items-center space-x-3">
            <AlertCircle size={24} className="text-red-600" />
            <div>
              <h3 className="text-red-800 font-semibold">Error Loading Investor</h3>
              <p className="text-red-600">{profileError}</p>
              <button 
                onClick={handleRefresh}
                className="mt-2 text-red-600 hover:text-red-800 text-sm font-medium underline"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Investor Profile */}
      <InvestorProfileCard profile={profile} loading={loadingProfile} />
      
      {/* Investment Data */}
      {investmentData && (
        <InvestmentDataCard 
          invested5050={investmentData.invested5050}
          invested6040={investmentData.invested6040}
          profit5050={investmentData.profit5050}
          profit6040={investmentData.profit6040}
          totalInvested={investmentData.totalInvested}
          returnPercentage={investmentData.returnPercentage}
        />
      )}
      
      {/* Bank Details */}
      <BankDetailsCard profile={profile} loading={loadingProfile} />
      
      {/* Documents */}
      <DocumentsCard profile={profile} loading={loadingProfile} />
      
      {/* TDS Certificates */}
      <TDSCertificatesCard 
        certificates={certificates}
        loading={loadingCertificates}
        error={certificatesError}
        selectedYear={selectedYear}
        onYearChange={handleYearChange}
        investorId={investorId}
        refetchCertificates={refetchCertificates}
      />
      
      {/* Transactions */}
      <TransactionsCard 
        transactions={transactions}
        loading={loadingTransactions}
        error={transactionsError}
        pagination={pagination}
        onPageChange={handleTransactionPageChange}
        refetchTransactions={handleRefresh} // Pass the refetch function here
      />

      {/* Add Funds Modal */}
      {isAddFundsModalOpen && (
        <AddFundsModal
          isOpen={isAddFundsModalOpen}
          onClose={() => setIsAddFundsModalOpen(false)}
          investor={profile}
          onSuccess={handleModalSuccess}
        />
      )}

      {/* Withdraw Modal */}
      {isWithdrawModalOpen && (
        <WithdrawFundsModal
          isOpen={isWithdrawModalOpen}
          onClose={() => setIsWithdrawModalOpen(false)}
          investor={profile}
          onSuccess={handleModalSuccess}
        />
      )}

      {/* Export Option */}

      {isInvestorExportModalOpen && (
        <InvestorExportModal
          isOpen={isInvestorExportModalOpen}
          onClose={() => setIsInvestorExportModalOpen(false)}
          investor={profile}
          onSuccess={handleModalSuccess}
        />
      )}
    </div>
  );
};

export default InvestorDetails;