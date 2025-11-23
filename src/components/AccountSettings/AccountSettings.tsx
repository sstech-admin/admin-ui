import React from 'react';
import MaintenanceCard from './MaintenanceCard';
import NotificationCard from './NotificationCard';

const AccountSettings: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-50 via-white to-orange-50 rounded-2xl shadow-sm border border-gray-200 p-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Notification Settings</h1>
          <p className="text-gray-600">
            Manage your notification preferences and system configurations
          </p>
        </div>
      </div>

      {/* Settings Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Maintenance Card */}
        <MaintenanceCard />
        
        {/* Notification Card */}
        <NotificationCard />
      </div>
    </div>
  );
};

export default AccountSettings;