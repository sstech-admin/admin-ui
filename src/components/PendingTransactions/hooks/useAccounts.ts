import { useState, useEffect } from 'react';
import { apiService } from '../../../services/api';
import { Account, AccountsApiResponse } from '../types';

interface UseAccountsReturn {
  accounts: Account[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useAccounts = (): UseAccountsReturn => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response: AccountsApiResponse = await apiService.get('/transaction-accounts/getAllAccount');
      
      if (response.success && response.data) {
        setAccounts(response.data);
        console.log('Accounts loaded successfully:', response.data);
      } else {
        throw new Error(response.message || 'Failed to fetch accounts');
      }
    } catch (err: any) {
      console.error('Error fetching accounts:', err);
      setError(err.message || 'Failed to load accounts');
      setAccounts([]);
    } finally {
      setLoading(false);
    }
  };

  const refetch = async () => {
    await fetchAccounts();
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  return {
    accounts,
    loading,
    error,
    refetch
  };
};