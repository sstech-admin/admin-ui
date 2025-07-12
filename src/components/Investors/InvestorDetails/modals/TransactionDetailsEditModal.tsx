import React, { useState, useEffect } from "react";
import { X, ReceiptText, IndianRupee } from "lucide-react";
import { apiService } from "../../../../services/api";
import { useAccounts } from "../../../PendingTransactions/hooks/useAccounts";
import { showNotification } from "../../../../utils/utils";

interface TransactionDetailsEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: any;
}

const TransactionDetailsEditModal: React.FC<TransactionDetailsEditModalProps> = ({
  isOpen,
  onClose,
  transaction,
}) => {
  const { accounts, loading: loadingAccounts } = useAccounts();
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState("All");

  const [formData, setFormData] = useState({
    amount: 0,
    transactionalBankId: "",
    date: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (transaction) {
      setFormData({
        amount: transaction.amount || 0,
        transactionalBankId: transaction.transactionalBankId || "",
        date: transaction.createdAt
          ? new Date(transaction.createdAt).toISOString().slice(0, 10)
          : "",
      });

      const selected = accounts.find((a) => a.accountId === transaction.transactionalBankId);
      if (selected) setSelectedAccount(selected.name);
    }
  }, [transaction, accounts]);

  if (!isOpen || !transaction) return null;

  const handleAccountChange = (accountId: string, accountName: string) => {
    setSelectedAccount(accountName);
    setFormData((prev) => ({
      ...prev,
      transactionalBankId: accountId,
    }));
    setIsAccountOpen(false);
  };

  const handleChange = (key: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await apiService.editTransactionData(transaction.transactionId, formData);
      showNotification('Transaction updated successfully!', 'success');
      showNotification('Transaction updated successfully!', 'success');
      onClose();
    } catch (error:any) {
      console.error("Error updating transaction:", error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to update transaction. Please try again.';
      showNotification(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  const formatAmount = (amount: number) => {
    return `₹${amount.toLocaleString("en-IN")}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in">
        {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
            <h2 className="text-xl font-bold text-gray-900">Transaction Edit</h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          </div>

        {/* Read-only Details */}
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-500">Mode</p>
              <p className="text-base font-medium">{transaction.transactionMode}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Type</p>
              <p className="text-base font-medium">{transaction.transactionType}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Status</p>
              <span
                className={`inline-flex items-center gap-1 text-sm font-medium px-2 py-0.5 rounded-full ${
                  transaction.transactionStatus === "Completed"
                    ? "bg-green-100 text-green-700"
                    : transaction.transactionStatus === "Pending"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    transaction.transactionStatus === "Completed"
                      ? "bg-green-500"
                      : transaction.transactionStatus === "Pending"
                      ? "bg-yellow-500"
                      : "bg-red-500"
                  }`}
                />
                {transaction.transactionStatus}
              </span>
            </div>
            <div>
              <p className="text-xs text-gray-500">Reference Number</p>
              <p className="text-base font-medium">{transaction.transactionRefNumber}</p>
            </div>
            {transaction.note && (
              <div className="col-span-2">
                <p className="text-xs text-gray-500">Note</p>
                <p className="text-base">{transaction.note}</p>
              </div>
            )}
            {transaction.transactionImage && (
              <div className="col-span-2 space-y-2">
                <p className="text-xs text-gray-500">Screenshot</p>
                <img
                  src={transaction.transactionImage}
                  alt="Transaction screenshot"
                  className="rounded-lg border border-gray-200 shadow-sm max-h-72 object-contain"
                />
              </div>
            )}
          </div>

          {/* Editable Fields */}
          <div className="space-y-4 border-t border-gray-200 pt-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Amount</label>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => handleChange("amount", Number(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all bg-white text-gray-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-gray-500 mb-1">Transactional Bank</label>
              <div className="mb-4 relative">
                <button
                  type="button"
                  onClick={() => setIsAccountOpen((prev) => !prev)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white text-left flex justify-between items-center hover:border-cyan-400 transition-colors"
                >
                  <span>{selectedAccount}</span>
                  <svg
                    className={`w-4 h-4 transform transition-transform ${
                      isAccountOpen ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {isAccountOpen && !loadingAccounts && (
                  <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                    {accounts.map((account) => (
                      <button
                        key={account.accountId}
                        onClick={() => handleAccountChange(account.accountId, account.name)}
                        className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors ${
                          selectedAccount === account.name ? "bg-cyan-50 text-cyan-700" : ""
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span>{account.name}</span>
                          <span
                            className={`text-xs ${
                              account.amountColour === "green" ? "text-green-600" : "text-red-600"
                            }`}
                          >
                            {formatAmount(account.balance)}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs text-gray-500 mb-1">Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => handleChange("createdAt", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all bg-white text-gray-900"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center p-4 border-t border-gray-100 sticky bottom-0 bg-white">
          <button
            onClick={onClose}
            className="px-4 py-3   rounded-lg text-gray-600 hover:bg-gray-100 transition text-sm"
          >
            Close
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`py-3 px-4 rounded-xl font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all shadow-lg ${
                loading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:from-cyan-600 hover:to-blue-600'
              }`}          >
            {loading ? "Updating..." : "Update Transaction"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionDetailsEditModal;
