import React, { useEffect, useState } from 'react';
import { 
  IndianRupee, 
  TrendingUp, 
  TrendingDown, 
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  AlertCircle
} from 'lucide-react';

// Import reusable components
import PageHeader from './ProfitLoss/PageHeader';
import StatisticsCard from './ProfitLoss/StatisticsCard';
import PerformanceCards from './ProfitLoss/PerformanceCards';
import TransactionForm from './ProfitLoss/TransactionForm';
import TransactionTable from './ProfitLoss/TransactionTable';

// Import hooks and utilities
import { useTransactions } from './ProfitLoss/hooks/useTransactions';
import { useStatistics } from './ProfitLoss/hooks/useStatistics';
import { formatAmount, formatDate, getAmountColor, getTagColor } from './ProfitLoss/utils';
import { apiService } from '../services/api';

const ProfitLoss: React.FC = () => {
  // API data
  const { transactions, loading, error, refetch } = useTransactions();
  
  // Form state
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]); // Default to today
  const [selectedTag, setSelectedTag] = useState('');
  const [isTagDropdownOpen, setIsTagDropdownOpen] = useState(false);
  
  // Filter state
  const [filterTag, setFilterTag] = useState('All');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // Loading states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFinalizing, setIsFinalizing] = useState(false);
  
  // Notification state
  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error';
    visible: boolean;
  } | null>(null);

  // Options
  const tagOptions = ['New', 'Old'];
  const filterOptions = ['All', 'New', 'Old', 'Investment', 'Dividend', 'Loss', 'Profit', 'Trading', 'Bonus'];

  // Calculate statistics using custom hook
  const statistics = useStatistics(transactions, filterTag);
  
  // Filter entries
  const filteredEntries = filterTag === 'All' ? transactions : transactions.filter(entry => entry.tag === filterTag);

  // Show notification
  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type, visible: true });
    
    // Auto-hide after 3 seconds
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  // Event handlers
  const handleSave = async () => {
    if (!amount || !date || !selectedTag) {
      showNotification('Please fill in all required fields', 'error');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const payload = {
        amount: parseFloat(amount),
        date,
        tag: selectedTag
      };
      
      console.log('Saving transaction:', payload);
      
      const response = await apiService.post('/amount/saveAmount', payload);
      
      if (response.success) {
        showNotification('Transaction saved successfully!', 'success');
        
        // Reset form
        setAmount('');
        setDate(new Date().toISOString().split('T')[0]);
        setSelectedTag('');
        
        // Refresh data
        await refetch();
      } else {
        throw new Error(response.message || 'Failed to save transaction');
      }
    } catch (error: any) {
      console.error('Error saving transaction:', error);
      showNotification(error.message || 'Failed to save transaction', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFinalAmount = async () => {
    if (!amount || !date || !selectedTag) {
      showNotification('Please fill in all required fields', 'error');
      return;
    }
    
    setIsFinalizing(true);
    
    try {
      const payload = {
        amount: parseFloat(amount),
        date,
        tag: selectedTag
      };
      
      console.log('Finalizing amount:', payload);
      
      const response = await apiService.post('/amount/finalAmount', payload);
      
      if (response.success) {
        showNotification('Final amount calculated successfully!', 'success');
        
        // Reset form
        setAmount('');
        setDate(new Date().toISOString().split('T')[0]);
        setSelectedTag('');
        
        // Refresh data
        await refetch();
      } else {
        throw new Error(response.message || 'Failed to calculate final amount');
      }
    } catch (error: any) {
      console.error('Error calculating final amount:', error);
      showNotification(error.message || 'Failed to calculate final amount', 'error');
    } finally {
      setIsFinalizing(false);
    }
  };

  const handleTagSelect = (tag: string) => {
    setSelectedTag(tag);
    setIsTagDropdownOpen(false);
  };

  const handleFilterChange = (filter: string) => {
    setFilterTag(filter);
    setIsFilterOpen(false);
  };

  const handleRefresh = async () => {
    await refetch();
  };

  const handleExport = () => {
    console.log('Exporting data...');
    // Create CSV data
    const csvData = filteredEntries.map(entry => ({
      Amount: entry.amount,
      Tag: entry.tag,
      Date: entry.date,
      Category: entry.category,
      Status: entry.status,
    }));
    
    // Convert to CSV string
    const csvString = [
      Object.keys(csvData[0] || {}).join(','),
      ...csvData.map(row => Object.values(row).join(','))
    ].join('\n');
    
    // Download CSV
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `profit-loss-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader 
        onRefresh={handleRefresh} 
        onExport={handleExport}
        loading={loading}
        error={error}
      />

      {/* Notification */}
      {notification && notification.visible && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg text-white font-medium transition-all duration-300 ${
          notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
        }`}>
          {notification.type === 'success' ? (
            <div className="flex items-center space-x-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>{notification.message}</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <AlertCircle size={20} />
              <span>{notification.message}</span>
            </div>
          )}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <div className="flex items-center justify-center space-x-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-cyan-500"></div>
            <span className="text-gray-600">Loading transaction data...</span>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
              <span className="text-red-600 text-sm">!</span>
            </div>
            <div>
              <h3 className="text-red-800 font-semibold">Error Loading Data</h3>
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
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatisticsCard
          title="Net Amount"
          value={`${statistics.netAmount >= 0 ? '+' : ''}${formatAmount(statistics.netAmount)}`}
          subtitle={`${statistics.profitPercentage.toFixed(1)}% profit ratio`}
          icon={IndianRupee}
          trendIcon={statistics.netAmount >= 0 ? ArrowUpRight : ArrowDownRight}
          color={statistics.netAmount >= 0 ? 'emerald' : 'red'}
        />
        
        <StatisticsCard
          title="Total Profit"
          value={`+${formatAmount(statistics.totalProfit)}`}
          subtitle={`${statistics.profitTransactions} transactions`}
          icon={TrendingUp}
          trendIcon={TrendingUp}
          color="emerald"
        />
        
        <StatisticsCard
          title="Total Loss"
          value={`-${formatAmount(statistics.totalLoss)}`}
          subtitle={`${statistics.lossTransactions} transactions`}
          icon={TrendingDown}
          trendIcon={TrendingDown}
          color="red"
        />
        
        <StatisticsCard
          title="Total Transactions"
          value={statistics.totalTransactions.toString()}
          subtitle={`${statistics.pendingTransactions} pending`}
          icon={BarChart3}
          trendIcon={Activity}
          color="blue"
        />
      </div>

      {/* Performance Cards */}
      <PerformanceCards statistics={statistics} formatAmount={formatAmount} />

      {/* Transaction Form */}
      <TransactionForm
        amount={amount}
        date={date}
        selectedTag={selectedTag}
        isTagDropdownOpen={isTagDropdownOpen}
        tagOptions={tagOptions}
        onAmountChange={setAmount}
        onDateChange={setDate}
        onTagSelect={handleTagSelect}
        onTagDropdownToggle={() => setIsTagDropdownOpen(!isTagDropdownOpen)}
        onSave={handleSave}
        onFinalAmount={handleFinalAmount}
        getTagColor={getTagColor}
        isSubmitting={isSubmitting}
        isFinalizing={isFinalizing}
      />

      {/* Transaction Table */}
      <TransactionTable
        entries={filteredEntries}
        totalEntries={transactions.length}
        filterTag={filterTag}
        isFilterOpen={isFilterOpen}
        filterOptions={filterOptions}
        onFilterChange={handleFilterChange}
        onFilterToggle={() => setIsFilterOpen(!isFilterOpen)}
        formatAmount={formatAmount}
        formatDate={formatDate}
        getAmountColor={getAmountColor}
        getTagColor={getTagColor}
        loading={loading}
      />
    </div>
  );
};

export default ProfitLoss;