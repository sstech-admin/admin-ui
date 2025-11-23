import { TrendingUp, DollarSign, PiggyBank, Wallet, Target, HandCoins } from 'lucide-react';

interface InvestmentDataProps {
  invested5050: number;
  invested6040: number;
  profit5050: number;
  profit6040: number;
  totalInvested: number;
  returnPercentage: number;
}

function InvestmentDataCard({ invested5050, invested6040, profit5050, profit6040, totalInvested, returnPercentage }: InvestmentDataProps) {

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Calculate total of all four values
  const totalOfAll = invested5050 + invested6040 + profit5050 + profit6040;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-6 pb-2 border-b border-gray-100">Investment Data</h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
          <div className="flex items-center gap-2 mb-2">
            <HandCoins className="w-4 h-4 text-yellow-600" />
            <span className="text-sm text-gray-600">Invested 5050</span>
          </div>
          <p className="text-xl font-semibold text-gray-800">{formatCurrency(invested5050)}</p>
        </div>
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
          <div className="flex items-center gap-2 mb-2">
            <PiggyBank className="w-4 h-4 text-blue-600" />
            <span className="text-sm text-gray-600">Invested 6040</span>
          </div>
          <p className="text-xl font-semibold text-gray-800">{formatCurrency(invested6040)}</p>
        </div>

        <div className="bg-green-50 rounded-lg p-4 border border-green-100">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-green-600" />
            <span className="text-sm text-gray-600">Profit 5050</span>
          </div>
          <p className="text-xl font-semibold text-gray-800">{formatCurrency(profit5050)}</p>
        </div>

        <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-100">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-4 h-4 text-emerald-600" />
            <span className="text-sm text-gray-600">Profit 6040</span>
          </div>
          <p className="text-xl font-semibold text-gray-800">{formatCurrency(profit6040)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">

        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wallet className="w-5 h-5 text-gray-600" />
            <span className="text-sm font-medium text-gray-600">Total</span>
          </div>
          <p className="text-xl font-semibold text-gray-800">{formatCurrency(totalOfAll)}</p>
        </div>

        <div className="bg-teal-50 rounded-lg p-4 border border-teal-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-teal-600" />
            <span className="text-sm font-medium text-gray-600">Return Percentage</span>
          </div>
          <p className={`text-xl font-semibold ${returnPercentage >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {returnPercentage >= 0 ? '+' : ''}{returnPercentage.toFixed(2)}%
          </p>
        </div>
      </div>
    </div>
  );
}

export default InvestmentDataCard;
