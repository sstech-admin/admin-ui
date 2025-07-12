// TransactionDetailsModal.tsx
import React from "react";
import { X, ReceiptText, IndianRupee } from "lucide-react";

interface TransactionDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: any; // Replace with proper typing if you have
}

const TransactionDetailsModal: React.FC<TransactionDetailsModalProps> = ({
  isOpen,
  onClose,
  transaction,
}) => {
  if (!isOpen || !transaction) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto transition-transform duration-300 animate-in fade-in zoom-in">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <ReceiptText className="text-cyan-600" size={20} />
            <h2 className="text-lg font-semibold text-gray-900">
              Transaction Details
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-500">Amount</p>
              <p className="flex items-center gap-1 text-base font-semibold text-gray-800">
                <IndianRupee size={16} className="text-cyan-600" />
                {transaction.amountColour === "green" ? "+" : "-"}
                {transaction.amount.toLocaleString("en-IN")}
              </p>
            </div>
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
                className={`inline-flex items-center gap-1 text-sm font-medium px-2 py-0.5 rounded-full
                ${
                  transaction.transactionStatus === "Completed"
                    ? "bg-green-100 text-green-700"
                    : transaction.transactionStatus === "Pending"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full
                  ${
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
              <p className="text-xs text-gray-500">Date</p>
              <p className="text-base font-medium">
                {new Date(transaction.createdAt).toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Bank</p>
              <p className="text-base font-medium">{transaction.transactionBank || "N/A"}</p>
            </div>
            <div className="col-span-2">
              <p className="text-xs text-gray-500">Reference Number</p>
              <p className="text-base font-medium">{transaction.transactionRefNumber}</p>
            </div>
            {transaction.note && (
              <div className="col-span-2">
                <p className="text-xs text-gray-500">Note</p>
                <p className="text-base">{transaction.note}</p>
              </div>
            )}
          </div>

          {transaction.transactionImage && (
            <div className="space-y-2">
              <p className="text-xs text-gray-500">Screenshot</p>
              <img
                src={transaction.transactionImage}
                alt="Transaction screenshot"
                className="rounded-lg border border-gray-200 shadow-sm max-h-72 object-contain"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionDetailsModal;
