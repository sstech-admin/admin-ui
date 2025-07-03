import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import LoginPage from './components/auth/LoginPage';
import Sidebar from './components/Sidebar';
import UsersTable from './components/UsersTable';
import ProfitLoss from './components/ProfitLoss';
import ViewInvestors from './components/Investors/ViewInvestors';
import AddInvestor from './components/Investors/AddInvestor/AddInvestor';
import Referrals from './components/Investors/Referrals/Referrals';
import ReferenceInvestors from './components/Investors/Referrals/ReferenceInvestors/ReferenceInvestors';
import Dashboard from './components/Dashboard/Dashboard';
import Payouts from './components/Payouts/Payouts';
import BulkTransactions from './components/BulkTransactions/BulkTransactions';
import BulkTransactionDetails from './components/BulkTransactions/BulkTransactionDetails/BulkTransactionDetails';
import Transactions from './components/Transactions/Transactions';
import PendingTransactions from './components/PendingTransactions/PendingTransactions';
import AddFunds from './components/AddFunds/AddFunds';
import InvestorDetails from './components/Investors/InvestorDetails/InvestorDetails';
import AddTransaction from './components/AddTransaction/AddTransaction';
import WithdrawFunds from './components/WithdrawFunds/WithdrawFunds';
import AllAccounts from './components/AllAccounts/AllAccounts';
import TallyExport from './components/TallyExport/TallyExport';
import NotFound from './components/NotFound';
// import PendingInvestors from './components/Investors/PendingInvestors';
import PendingInvestors from './components/Investors/PendingInvestors/PendingInvestors';
import EditInvestor from './components/Investors/EditInvestor/EditInvestor';
const DashboardLayout: React.FC = () => {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="max-w-7xl mx-auto">
            <Routes>
              {/* Dashboard Routes */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              
              {/* User Routes */}
              <Route path="/users" element={<UsersTable />} />
              
              {/* Investor Routes */}
              <Route path="/investors" element={<ViewInvestors />} />
              <Route path="/investors/pending" element={<PendingInvestors />} />
              <Route path="/investors/add" element={<AddInvestor onBack={() => window.history.back()} />} />
              <Route path="/investors/edit/:investorId" element={<EditInvestor />} />
              <Route path="/investors/:investorId" element={<InvestorDetails />} />
              <Route path="/investors/referrals" element={<Referrals />} />
              <Route path="/reference-investors/:referenceId" element={<ReferenceInvestors />} />
              <Route path="/investors/reports" element={
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Investor Reports</h2>
                  <p className="text-gray-600">This section is under development.</p>
                </div>
              } />
              
              {/* Transaction Routes */}
              <Route path="/profit-loss" element={<ProfitLoss />} />
              <Route path="/payouts" element={<Payouts />} />
              <Route path="/bulk-transactions" element={<BulkTransactions />} />
              <Route path="/bulk-transaction/:bulkTransactionId" element={<BulkTransactionDetails />} />
              <Route path="/transactions" element={<Transactions />} />
              <Route path="/pending-transactions" element={<PendingTransactions />} />
              <Route path="/add-transaction" element={<AddTransaction />} />
              <Route path="/add-funds" element={<AddFunds />} />
              <Route path="/withdraw-funds" element={<WithdrawFunds />} />
              
              {/* Account Routes */}
              <Route path="/all-accounts" element={<AllAccounts />} />
              <Route path="/account-settings" element={
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Account Settings</h2>
                  <p className="text-gray-600">This section is under development.</p>
                </div>
              } />
              <Route path="/profile" element={
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Profile</h2>
                  <p className="text-gray-600">This section is under development.</p>
                </div>
              } />
              <Route path="/security" element={
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Security</h2>
                  <p className="text-gray-600">This section is under development.</p>
                </div>
              } />
              
              {/* Tally Export Route */}
              <Route path="/tally-export" element={<TallyExport />} />
              
              {/* Catch all route - redirect to 404 page */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </div>
      </main>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route 
            path="/*" 
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;