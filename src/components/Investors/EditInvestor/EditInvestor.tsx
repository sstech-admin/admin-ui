import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Loader2, AlertCircle } from 'lucide-react';
import EditInvestorForm from './EditInvestorForm';
import { InvestorFormData } from '../AddInvestor/types';
import { apiService } from '../../../services/api';

const EditInvestor: React.FC = () => {
  const navigate = useNavigate();
  const { investorId } = useParams<{ investorId: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [investorData, setInvestorData] = useState<any>(null);

  useEffect(() => {
    const fetchInvestorData = async () => {
      if (!investorId) return;
      
      try {
        setLoading(true);
        setError(null);
        
        const response = await apiService.get(`/investor/admin/getInvestorProfile/${investorId}`);
        
        if (response.success && response.data) {
          setInvestorData(response.data);
        } else {
          throw new Error(response.message || 'Failed to fetch investor data');
        }
      } catch (err: any) {
        console.error('Error fetching investor data:', err);
        setError(err.message || 'Failed to load investor data');
      } finally {
        setLoading(false);
      }
    };

    fetchInvestorData();
  }, [investorId]);

  const handleBack = () => {
    navigate('/investors');
  };

  const handleSubmit = async (formData: InvestorFormData): Promise<void> => {
    try {
      console.log('Submitting investor data:', formData);
      
      // Create FormData for file uploads
      const submitData = new FormData();
      
      // Add all form fields
      Object.entries(formData).forEach(([key, value]) => {
        if (value instanceof File) {
          submitData.append(key, value);
        } else if (value !== undefined && value !== null) {
          submitData.append(key, value.toString());
        }
      });

      // Call API to update investor
      const response = await apiService.put(`/investor/admin/updateInvestor/${investorId}`, submitData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.success) {
        console.log('Investor updated successfully');
        navigate(`/investors/${investorId}`);
        return;
      } else {
        throw new Error(response.message || 'Failed to update investor');
      }
    } catch (error) {
      console.error('Error updating investor:', error);
      throw new Error('Failed to update investor. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 size={48} className="animate-spin text-cyan-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-8 my-6">
        <div className="flex items-center space-x-3">
          <AlertCircle size={24} className="text-red-600" />
          <div>
            <h3 className="text-red-800 font-semibold">Error Loading Investor</h3>
            <p className="text-red-600">{error}</p>
            <button 
              onClick={handleBack}
              className="mt-2 text-red-600 hover:text-red-800 text-sm font-medium underline"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <EditInvestorForm
      investorData={investorData}
      onBack={handleBack}
      onSubmit={handleSubmit}
    />
  );
};

export default EditInvestor;