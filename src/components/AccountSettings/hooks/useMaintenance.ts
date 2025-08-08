import { useState, useEffect } from 'react';
import { apiService } from '../../../services/api';
import { MaintenanceNote, MaintenanceNoteApiResponse, MaintenanceUpdatePayload } from '../types';

interface UseMaintenanceReturn {
  maintenance: MaintenanceNote | null;
  loading: boolean;
  error: string | null;
  updating: boolean;
  updateMaintenance: (data: MaintenanceUpdatePayload) => Promise<void>;
  refetch: () => Promise<void>;
}

export const useMaintenance = (): UseMaintenanceReturn => {
  const [maintenance, setMaintenance] = useState<MaintenanceNote | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);

  const fetchMaintenance = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response: MaintenanceNoteApiResponse = await apiService.get('/maintenance-note');
      
      // Handle both response formats
      let maintenanceData: MaintenanceNote;
      
      if (response.data) {
        // Wrapped response format
        maintenanceData = response.data;
      } else if (response._id) {
        // Direct response format
        maintenanceData = {
          _id: response._id,
          title: response.title || '',
          subtitle: response.subtitle || '',
          description: response.description || '',
          status: response.status || 'inactive',
          createdAt: response.createdAt || '',
          updatedAt: response.updatedAt || '',
          __v: response.__v || 0
        };
      } else {
        throw new Error('Invalid response format');
      }
      
      setMaintenance(maintenanceData);
      console.log('Successfully loaded maintenance note:', maintenanceData);
    } catch (err: any) {
      console.error('Error fetching maintenance note:', err);
      setError(err.message || 'Failed to load maintenance settings');
      
      // Fallback to mock data for development
      const mockMaintenance: MaintenanceNote = {
        _id: "68891311c62438482cbd669a",
        title: "Maintain",
        subtitle: "maintenance mode test",
        description: "app will be in maintenance, will notify once done",
        status: "inactive",
        createdAt: "2025-07-29T18:29:37.293Z",
        updatedAt: "2025-07-30T17:01:12.383Z",
        __v: 0
      };
      setMaintenance(mockMaintenance);
    } finally {
      setLoading(false);
    }
  };

  const updateMaintenance = async (data: MaintenanceUpdatePayload) => {
    try {
      setUpdating(true);
      setError(null);
      
      console.log('Updating maintenance note with payload:', data);
      
      const response = await apiService.put('/maintenance-note', data);
      
      if (response.success !== false) {
        // Refresh data after successful update
        await fetchMaintenance();
        console.log('Maintenance note updated successfully');
      } else {
        throw new Error(response.message || 'Failed to update maintenance note');
      }
    } catch (err: any) {
      console.error('Error updating maintenance note:', err);
      setError(err.message || 'Failed to update maintenance settings');
      throw err;
    } finally {
      setUpdating(false);
    }
  };

  const refetch = async () => {
    await fetchMaintenance();
  };

  useEffect(() => {
    fetchMaintenance();
  }, []);

  return {
    maintenance,
    loading,
    error,
    updating,
    updateMaintenance,
    refetch
  };
};