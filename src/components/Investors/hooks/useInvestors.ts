import { useState, useEffect, useCallback } from 'react';
import { apiService } from '../../../services/api';
import { Investor, ApiInvestor, InvestorsApiResponse, InvestorsFilters } from '../types';

interface UseInvestorsReturn {
  investors: Investor[];
  loading: boolean;
  error: string | null;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalInvestors: number;
    limit: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  filters: InvestorsFilters;
  setFilters: (filters: Partial<InvestorsFilters>) => void;
  refetch: () => Promise<void>;
}

// Transform API investor data to our Investor interface
const transformApiInvestor = (apiInvestor: ApiInvestor): Investor => {
  return {
    id: apiInvestor._id,
    name: apiInvestor.name,
    username: apiInvestor.userName,
    email: '', // Not provided in API response
    phoneNumber: '', // Not provided in API response
    paymentSystem: getPaymentSystem(apiInvestor.paymentSystemName),
    amount: apiInvestor.amount || 0,
    amountText: apiInvestor.amountText || 'You\'ll Give',
    amountColour: apiInvestor.amountColour || 'red',
    investorType: apiInvestor.investorTypeName || '',
    status: 'Active', // Assuming all returned investors are active
    panCardNumber: apiInvestor.panCardNumber,
    aadharCardNumber: apiInvestor.aadharCardNumber
  };
};

// Map payment system string to our enum
const getPaymentSystem = (paymentSystemName: string): 'Monthly' | 'Quarterly' | 'Yearly' | 'None' => {
  const normalizedPayment = paymentSystemName?.toLowerCase();
  switch (normalizedPayment) {
    case 'monthly':
      return 'Monthly';
    case 'quarterly':
      return 'Quarterly';
    case 'yearly':
      return 'Yearly';
    case 'none':
    default:
      return 'None';
  }
};

export const useInvestors = (): UseInvestorsReturn => {
  const [investors, setInvestors] = useState<Investor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalInvestors: 0,
    limit: 20,
    hasNext: false,
    hasPrev: false
  });
  const [filters, setFiltersState] = useState<InvestorsFilters>({
    page: 1,
    limit: 20,
    search: '',
    investorStatusId: 1 // Default to active investors
  });

  const fetchInvestors = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const queryParams = new URLSearchParams({
        page: filters.page.toString(),
        limit: filters.limit.toString(),
        search: filters.search,
        investorStatusId: (filters.investorStatusId || 1).toString()
      });

      if (filters.paymentSystem && filters.paymentSystem !== 'All') {
        queryParams.append('paymentSystemId', filters.paymentSystem);
      }

      console.log('Fetching investors with params:', queryParams.toString());
      
      const response: InvestorsApiResponse = await apiService.get(`/investor/admin/all?${queryParams.toString()}`);
      
      console.log('API Response:', response);
      
      if (response.success && response.data && response.data.results) {
        // Transform API investors to our Investor interface
        const transformedInvestors = response.data.results.map(transformApiInvestor);
        
        setInvestors(transformedInvestors);
        setPagination({
          currentPage: response.data.page,
          totalPages: response.data.totalPages,
          totalInvestors: response.data.totalResults,
          limit: response.data.limit,
          hasNext: response.data.page < response.data.totalPages,
          hasPrev: response.data.page > 1
        });
        
        console.log('Successfully loaded investors:', transformedInvestors.length);
      } else {
        throw new Error(response.message || 'Failed to fetch investors');
      }
    } catch (err: any) {
      console.error('Error fetching investors:', err);
      setError(err.message || 'Failed to load investors');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const setFilters = (newFilters: Partial<InvestorsFilters>) => {
    console.log('Setting new filters:', newFilters);
    setFiltersState(prev => ({ ...prev, ...newFilters }));
  };

  const refetch = async () => {
    console.log('Refetching investors...');
    await fetchInvestors();
  };

  useEffect(() => {
    fetchInvestors();
  }, [fetchInvestors]);

  return {
    investors,
    loading,
    error,
    pagination,
    filters,
    setFilters,
    refetch
  };
};