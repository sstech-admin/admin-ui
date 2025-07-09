export function maskString(str: string) {
  if (typeof str !== 'string') {
    throw new TypeError('Input must be a string.');
  }

  if (str.length <= 6) {
    return str;
  }

  const firstThree = str.slice(0, 3);
  const lastThree = str.slice(-3);
  return `${firstThree}...${lastThree}`;
}

export const formatAmountIndian = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Math.abs(amount));
};

export const showNotification = (message: string, type: 'success' | 'error') => {
    // Create a simple toast notification
    const toast = document.createElement('div');
    toast.className = `fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg text-white font-medium transition-all duration-300 ${type === 'success' ? 'bg-green-500' : 'bg-red-500'
      }`;
    toast.textContent = message;

    document.body.appendChild(toast);

    // Animate in
    setTimeout(() => {
      toast.style.transform = 'translateX(0)';
      toast.style.opacity = '1';
    }, 100);

    // Remove after 4 seconds
    setTimeout(() => {
      toast.style.transform = 'translateX(100%)';
      toast.style.opacity = '0';
      setTimeout(() => {
        if (document.body.contains(toast)) {
          document.body.removeChild(toast);
        }
      }, 300);
    }, 4000);
  };

  // ConvertExcel.js
export function convertExcel(bufferData: ArrayBuffer | Uint8Array, filename: string): void {
  const byteArray = bufferData instanceof Uint8Array
    ? bufferData
    : new Uint8Array(bufferData);

  const blob = new Blob([byteArray], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}

export const paymentTypeOptions = [
    { value: '', label: 'All' },
    { value: '31', label: 'Monthly' },
    { value: '7', label: 'None' }
  ];
  